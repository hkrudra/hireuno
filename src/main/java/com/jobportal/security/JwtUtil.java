package com.jobportal.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET =
            "jobportal-super-secret-jwt-key-2026-secure-key";

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24; // 24 hours

    private static SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
        );
    }

    public static String generateToken(
            String email,
            String role,
            Long userId) {

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(getSigningKey())
                .compact();
    }

    public static Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public static String extractRole(String token) {
        return extractClaims(token)
                .get("role", String.class);
    }

    public static Long extractUserId(String token) {

        Number userId = extractClaims(token)
                .get("userId", Number.class);

        return userId.longValue();
    }
}