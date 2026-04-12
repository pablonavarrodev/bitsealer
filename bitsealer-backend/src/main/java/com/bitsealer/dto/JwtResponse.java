package com.bitsealer.dto;

public record JwtResponse(String accessToken, UserDto user) {}