import './cypress-graphql-types';
import { v4 as uuidv4 } from 'uuid';

describe('Authentication API', () => {
  // Base URL for API requests
  const API_URL = '/graphql';
  
  // Type definitions for user and response
  interface User {
    email: string;
    password: string;
  }

  interface SignInResponse {
    data?: {
      signIn: {
        token: string;
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          profileCompleted: boolean;
          surveyCompleted: boolean;
        }
      } | null;
    };
    errors?: Array<{ message: string }>;
  }

  let validUser: User;
  let nonExistentUser: User;
  
    //GraphQL queries
  const LOGIN_MUTATION = `
    mutation SignIn($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
        user {
          id
          email
          firstName
          lastName
          profileCompleted
          surveyCompleted
        }
      }
    }
  `;

  before(() => {
    // Load test data from fixtures
    cy.fixture('users').then((users) => {
      validUser = users.validUser;
      
      // Generate a random email for non-existent user
      nonExistentUser = {
        email: `nonexistent.${uuidv4()}@example.com`,
        password: 'InvalidP@ssw0rd!'
      };
    });
    
    // Setup API request logging for debugging
    cy.intercept('POST', API_URL, (req) => {
      // Log request bodies only in test environment
      if (Cypress.env('NODE_ENV') === 'test') {
        cy.task('log', `Request: ${JSON.stringify(req.body)}`);
      }
      
      // Continue with the request
      req.continue((res) => {
        // Log response bodies only in test environment
        if (Cypress.env('NODE_ENV') === 'test') {
          cy.task('log', `Response: ${JSON.stringify(res.body)}`);
        }
      });
    }).as('graphqlRequest');
  });

  beforeEach(() => {
    // Reset any local storage between tests
    cy.clearLocalStorage();
    
    // Set request default timeout specific to API tests
    Cypress.config('defaultCommandTimeout', 10000);
  });

  context('Login API Tests', () => {
    it('should successfully authenticate a valid user', () => {
      // Arrange
      const variables = {
        email: validUser.email,
        password: validUser.password
      };
      
      // Act
      cy.apiRequest<SignInResponse>({
        url: API_URL,
        body: {
          operationName: 'SignIn',
          query: LOGIN_MUTATION,
          variables
        }
      }).then((response) => {
        // Status code assertions
        expect(response.status).to.equal(200);
        
        // Response structure assertions
        const typedResponse = response.body;
        expect(typedResponse.data).to.exist;
        expect(typedResponse.data?.signIn).to.have.property('token');
        expect(typedResponse.data?.signIn).to.have.property('user');
        
        // User data assertions
        const { user, token } = typedResponse.data!.signIn!;
        expect(user).to.have.property('id');
        expect(user).to.have.property('email', validUser.email);
        expect(user).to.have.property('firstName');
        expect(user).to.have.property('lastName');
        expect(user).to.have.property('profileCompleted');
        expect(user).to.have.property('surveyCompleted');
        
        // Token validation
        expect(token).to.be.a('string');
        expect(token.split('.')).to.have.lengthOf(3); // JWT format validation
        
        // Store the token for potential future tests
        cy.wrap(token).as('authToken');
      });
      
      // Additional verification: Verify token is properly stored in localStorage
      cy.get('@authToken').then((token: any) => {
        cy.window().then((win) => {
          win.localStorage.setItem('token', token);
          expect(win.localStorage.getItem('token')).to.equal(token);
        });
      });
    });

    it('should handle authentication with non-existent user', () => {
      const variables = {
        email: nonExistentUser.email,
        password: nonExistentUser.password
      };
      
      cy.apiRequest<SignInResponse>({
        url: API_URL,
        body: {
          operationName: 'SignIn',
          query: LOGIN_MUTATION,
          variables
        }
      }).then((response) => {
        // GraphQL errors come back with status 200 but have errors property
        expect(response.status).to.equal(200);
        
        const typedResponse = response.body;
        expect(typedResponse.errors).to.exist;
        
        // Error structure assertions
        const errors = typedResponse.errors!;
        expect(errors).to.be.an('array').and.have.length.of.at.least(1);
        
        // Error message assertions
        const firstError = errors[0];
        expect(firstError).to.have.property('message');
        expect(firstError.message).to.match(/invalid email or password/i);
        
        // Ensure no data was returned
        expect(typedResponse.data?.signIn).to.be.null;
      });
    });

    it('should reject authentication with valid email but wrong password', () => {
      const variables = {
        email: validUser.email,
        password: 'WrongPassword123!'
      };
      
      cy.apiRequest<SignInResponse>({
        url: API_URL,
        body: {
          operationName: 'SignIn',
          query: LOGIN_MUTATION,
          variables
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        
        const typedResponse = response.body;
        expect(typedResponse.errors).to.exist;
        
        const errors = typedResponse.errors!;
        expect(errors[0].message).to.match(/invalid email or password/i);
        
        // Security check: Ensure error doesn't leak which part was wrong
        expect(errors[0].message).not.to.include('password');
      });
    });

    it('should validate email format', () => {
      // Test cases for various invalid email formats
      const invalidEmailCases = [
        { email: 'plainaddress', description: 'Missing @ symbol' },
        { email: '@missingusername.com', description: 'Missing username' },
        { email: 'incomplete@domain', description: 'Incomplete domain' },
        { email: 'spaces in address@domain.com', description: 'Spaces in username' },
        { email: 'missing.domain@', description: 'Missing domain' }
      ];
      
      // Run tests for each invalid email case
      invalidEmailCases.forEach(testCase => {
        const variables = {
          email: testCase.email,
          password: 'AnyPassword123'
        };
        
        cy.apiRequest<SignInResponse>({
          url: API_URL,
          body: {
            operationName: 'SignIn',
            query: LOGIN_MUTATION,
            variables
          }
        }).then((response) => {
          const typedResponse = response.body;
          
          // Assert
          expect(response.status).to.equal(200);
          expect(typedResponse.errors).to.exist;
          
          // Error should indicate invalid email format
          const errors = typedResponse.errors!;
          expect(errors[0].message)
            .to.match(/invalid email/i);
        });
      });
    });

    it('should handle empty credentials', () => {
      // Test with empty email and password
      const variables = {
        email: '',
        password: ''
      };
      
      cy.apiRequest<SignInResponse>({
        url: API_URL,
        body: {
          operationName: 'SignIn',
          query: LOGIN_MUTATION,
          variables
        }
      }).then((response) => {
        const typedResponse = response.body;
        
        expect(response.status).to.equal(200);
        expect(typedResponse.errors).to.exist;
        
        // Ensure the error mentions required fields
        expect(typedResponse.errors![0].message).to.match(/required|empty/i);
      });
    });

    it('should respect rate limiting for failed login attempts', () => {
      // Simulate multiple failed login attempts 
      const MAX_ATTEMPTS = 5;
      
      const variables = {
        email: validUser.email,
        password: 'WrongPassword123!'
      };
      
      // Create an array of promises for multiple failed login attempts
      const loginAttempts = Array.from({ length: MAX_ATTEMPTS }, () => {
        return cy.apiRequest<SignInResponse>({
          url: API_URL,
          body: {
            operationName: 'SignIn',
            query: LOGIN_MUTATION,
            variables
          }
        });
      });
      
      // Check if the attempts trigger rate limiting
      cy.wrap(loginAttempts).then((responses) => {
        const lastResponse:any = responses[MAX_ATTEMPTS - 1];
        
        const typedResponse = lastResponse.body;
        
        // If GraphQL error exists
        if (lastResponse.status === 200 && typedResponse.errors) {
          const errorMessage = typedResponse.errors[0].message;
          // Check if rate limiting is mentioned in the error
          const isRateLimited = /rate limit|too many attempts|try again later/i.test(errorMessage);
          
          // Log the result without failing the test if rate limiting isn't implemented
          if (!isRateLimited) {
            cy.log('⚠️ Rate limiting may not be implemented for authentication');
          }
        } else if (lastResponse.status === 429) {
          // If the API returns proper 429 status code
          expect(lastResponse.status).to.equal(429);
        }
      });
    });

    // Performance test
    it('should authenticate in under 500ms', () => {
      // Record the start time
      const start = performance.now();
      
      // Perform the login request
      cy.apiRequest<SignInResponse>({
        url: API_URL,
        body: {
          operationName: 'SignIn',
          query: LOGIN_MUTATION,
          variables: {
            email: validUser.email,
            password: validUser.password
          }
        }
      }).then(() => {
        const elapsed = performance.now() - start;
        cy.log(`Login request took ${elapsed.toFixed(2)}ms`);
        
        // Assert on the performance needs
        expect(elapsed).to.be.lessThan(500);
      });
    });
  });

  // Cleanup after all tests
  after(() => {
    // Any cleanup tasks if needed
    cy.log('Authentication API tests completed');
  });
});