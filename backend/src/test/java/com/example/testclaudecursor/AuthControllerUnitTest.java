package com.example.testclaudecursor;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AuthControllerUnitTest {

    @Test
    void testLoginRequestGettersAndSetters() {
        AuthController.LoginRequest request = new AuthController.LoginRequest();
        
        request.setUsername("testuser");
        request.setPassword("testpass");
        
        assertEquals("testuser", request.getUsername());
        assertEquals("testpass", request.getPassword());
    }

    @Test
    void testLoginResponseGettersAndSetters() {
        AuthController.LoginResponse response = new AuthController.LoginResponse(true, "Success", "testuser");
        
        assertTrue(response.isSuccess());
        assertEquals("Success", response.getMessage());
        assertEquals("testuser", response.getUsername());
        
        response.setSuccess(false);
        response.setMessage("Failed");
        response.setUsername("otheruser");
        
        assertFalse(response.isSuccess());
        assertEquals("Failed", response.getMessage());
        assertEquals("otheruser", response.getUsername());
    }

    @Test
    void testLoginResponseConstructor() {
        AuthController.LoginResponse response = new AuthController.LoginResponse(true, "Login successful", "admin");
        
        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertEquals("admin", response.getUsername());
    }

    @Test
    void testLoginResponseNullValues() {
        AuthController.LoginResponse response = new AuthController.LoginResponse(false, null, null);
        
        assertFalse(response.isSuccess());
        assertNull(response.getMessage());
        assertNull(response.getUsername());
    }

    @Test
    void testLoginRequestNullValues() {
        AuthController.LoginRequest request = new AuthController.LoginRequest();
        
        assertNull(request.getUsername());
        assertNull(request.getPassword());
        
        request.setUsername(null);
        request.setPassword(null);
        
        assertNull(request.getUsername());
        assertNull(request.getPassword());
    }
}