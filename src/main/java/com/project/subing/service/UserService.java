package com.project.subing.service;

import com.project.subing.domain.user.entity.User;
import com.project.subing.dto.user.LoginRequest;
import com.project.subing.dto.user.SignupRequest;
import com.project.subing.dto.user.UserResponse;
import com.project.subing.repository.UserRepository;
import com.project.subing.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    public UserResponse signup(SignupRequest request) {
        // 이메일 중복 검사
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 사용자 생성 (BCrypt로 비밀번호 암호화)
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();

        User savedUser = userRepository.save(user);

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(savedUser.getId(), savedUser.getEmail());

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .token(token)
                .createdAt(savedUser.getCreatedAt())
                .build();
    }
    
    public UserResponse login(LoginRequest request) {
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 비밀번호 검증 (BCrypt 사용)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .token(token)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
