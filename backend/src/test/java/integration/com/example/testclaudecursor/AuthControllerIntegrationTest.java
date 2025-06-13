package integration.com.example.testclaudecursor;

import com.example.testclaudecursor.AuthController;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = com.example.testclaudecursor.TestClaudeCursorApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "supabase.url=http://test-supabase.com",
    "supabase.key=test-key"
})
class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testLoginEndpointExists() {
        AuthController.LoginRequest request = new AuthController.LoginRequest();
        request.setUsername("testuser");
        request.setPassword("testpass");

        ResponseEntity<AuthController.LoginResponse> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/auth/login",
            request,
            AuthController.LoginResponse.class
        );

        AuthController.LoginResponse body = response.getBody();
        assertNotNull(body);
        assertFalse(body.isSuccess());
    }

    @Test
    void testLoginWithNullRequest() {
        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/auth/login",
            null,
            String.class
        );

        assertEquals(415, response.getStatusCode().value());
    }
}