<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Domain\Property\Property;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use App\Interfaces\Http\Requests\Property\UploadPropertyImageRequest;
use App\Models\PropertyImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class PropertyImageController
{
    public function __construct(
        private readonly PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function store(UploadPropertyImageRequest $request, int $propertyId): JsonResponse
    {
        $property = $this->findPropertyOrFail($propertyId);
        $this->authorizeHost($request, $property);

        $file = $request->file('image');
        $path = $file->store('properties', 'public');

        if ($path === false) {
            return response()->json(['message' => 'Falha ao fazer upload da imagem.'], 500);
        }

        $isCover = $request->boolean('is_cover', false);

        if ($isCover) {
            $property->images()->where('is_cover', true)->update(['is_cover' => false]);
        }

        $maxOrder = $property->images()->max('order') ?? -1;

        $image = PropertyImage::create([
            'property_id' => $propertyId,
            'image_url' => Storage::url($path),
            'is_cover' => $isCover || $maxOrder === -1,
            'order' => $maxOrder + 1,
        ]);

        return response()->json([
            'id' => $image->id,
            'image_url' => $image->image_url,
            'is_cover' => $image->is_cover,
            'order' => $image->order,
        ], 201);
    }

    public function destroy(int $propertyId, int $imageId): JsonResponse
    {
        $property = $this->findPropertyOrFail($propertyId);
        $this->authorizeHost(request(), $property);

        $image = PropertyImage::where('property_id', $propertyId)->findOrFail($imageId);

        $relativePath = str_replace(Storage::url(''), '', $image->image_url);
        Storage::disk('public')->delete($relativePath);

        $wasCover = $image->is_cover;
        $image->delete();

        if ($wasCover) {
            $firstRemaining = $property->images()->orderBy('order')->first();
            if ($firstRemaining) {
                $firstRemaining->update(['is_cover' => true]);
            }
        }

        return response()->json(null, 204);
    }

    public function setCover(int $propertyId, int $imageId): JsonResponse
    {
        $property = $this->findPropertyOrFail($propertyId);
        $this->authorizeHost(request(), $property);

        $image = PropertyImage::where('property_id', $propertyId)->findOrFail($imageId);

        $property->images()->where('is_cover', true)->update(['is_cover' => false]);
        $image->update(['is_cover' => true]);

        return response()->json(['message' => 'Imagem definida como capa.']);
    }

    private function findPropertyOrFail(int $id): Property
    {
        $property = $this->propertyRepository->findById($id);
        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }
        return $property;
    }

    private function authorizeHost($request, Property $property): void
    {
        if ($property->host_id !== $request->user()->id) {
            abort(403, 'Você não é o anfitrião deste imóvel.');
        }
    }
}
