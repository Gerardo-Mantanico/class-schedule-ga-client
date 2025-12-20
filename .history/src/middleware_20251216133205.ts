import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin', '/paciente','/psm', '/administrativo']
  
  // Verificar si la ruta actual es protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      // Si no hay token, redirigir al login
      const url = new URL('/signin', request.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // Aquí podrías decodificar el token y verificar roles si es necesario
    // Por ejemplo, si tienes el rol en el token JWT:
    // const payload = JSON.parse(atob(token.split('.')[1]))
    // if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/paciente/:path*',
    '/psm/:path*',
    '/administrativo/:path*'
  ],
}
