<?php

namespace App\Interfaces\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        foreach ($roles as $role) {
            if ($role === 'host' && $user->isHost()) {
                return $next($request);
            }

            if ($role === 'guest' && ! $user->isHost()) {
                return $next($request);
            }

            if ($role === 'admin' && $user->isAdmin()) {
                return $next($request);
            }
        }

        abort(403, 'Forbidden.');
    }
}
