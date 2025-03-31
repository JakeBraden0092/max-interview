
declare global {
    namespace Cypress {
      // Custom GraphQL request type that explicitly matches RequestOptions structure
      interface GraphQLRequestOptions {
        method?: string;
        url?: string;
        body: GraphQLRequestBody;
        headers?: Record<string, string>;
        auth?: {
          username?: string;
          password?: string;
        };
        followRedirect?: boolean;
        failOnStatusCode?: boolean;
        timeout?: number;
      }
  
      // Define a type for GraphQL request body
      interface GraphQLRequestBody {
        operationName?: string;
        query: string;
        variables: Record<string, any>;
      }
  
      // Extend the Chainable interface with a generic type parameter
      interface Chainable<Subject = any> {
        // Define a more specific apiRequest method
        apiRequest<T = any>(
          options: GraphQLRequestOptions
        ): Chainable<Response<T>>;
      }
    }
  }
  
  // Custom type guard to validate GraphQL request body
  function isGraphQLRequestBody(body: any): body is Cypress.GraphQLRequestBody {
    return body && 
      typeof body.query === 'string' && 
      typeof body.variables === 'object';
  }
  
  // Add a custom command for GraphQL requests
  Cypress.Commands.add('apiRequest', (options: Cypress.GraphQLRequestOptions) => {
    // Validate GraphQL request body
    if (!isGraphQLRequestBody(options.body)) {
      throw new Error('Invalid GraphQL request body');
    }
  
    const requestOptions: Cypress.RequestOptions = {
        method: options.method || 'POST',
        url: options.url,
        body: options.body as any, // Cast to any to bypass strict type checking
        headers: options.headers,
        auth: options.auth,
        followRedirect: options.followRedirect ?? true,
        failOnStatusCode: options.failOnStatusCode ?? false,
        timeout: options.timeout ?? 30000,
        encoding: null,
        form: false,
        gzip: false,
        qs: undefined,
        log: false,
        retryOnStatusCodeFailure: false,
        retryOnNetworkFailure: false
    };
  
    return cy.request(requestOptions);
  });
  
  // Ensure the file can be imported as a module
  export {};