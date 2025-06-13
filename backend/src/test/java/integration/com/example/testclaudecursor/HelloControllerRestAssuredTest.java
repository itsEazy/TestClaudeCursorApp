package integration.com.example.testclaudecursor;


import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.testcontainers.junit.jupiter.Testcontainers;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(classes = com.example.testclaudecursor.TestClaudeCursorApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class HelloControllerRestAssuredTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    @Test
    void testGetHelloMessage() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("message", equalTo("Hello World"));
    }

    @Test
    void testHelloEndpointResponseStructure() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200)
            .body("message", instanceOf(String.class))
            .body("message", not(emptyString()))
            .body("$", hasKey("message"))
            .body("size()", equalTo(1));
    }

    @Test
    void testHelloEndpointContentType() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200)
            .contentType("application/json")
            .header("Content-Type", containsString("application/json"));
    }

    @Test
    void testHelloEndpointCorsHeaders() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200);
    }

    @Test
    void testHelloEndpointWithDifferentHttpMethods() {
        given()
        .when()
            .post("/hello")
        .then()
            .statusCode(405);

        given()
        .when()
            .put("/hello")
        .then()
            .statusCode(405);

        given()
        .when()
            .delete("/hello")
        .then()
            .statusCode(405);
    }

    @Test
    void testHelloEndpointResponseTime() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200)
            .time(lessThan(1000L));
    }
}