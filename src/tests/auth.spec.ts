describe('Authentication', () => {
  const testUser = {
    name: 'Cypress Test User',
    email: `cypress-${Date.now()}@test.com`,
    password: 'password123',
  };

  let authToken: string;

  describe('User Registration and Login', () => {
    it('should register a new user', () => {
      cy.request('POST', '/api/auth/register', testUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.email).to.eq(testUser.email);
      });
    });

    it('should prevent duplicate registration', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/register',
        body: testUser,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.include('Email already in use');
      });
    });

    it('should login with valid credentials', () => {
      cy.request('POST', '/api/auth/login', {
        email: testUser.email,
        password: testUser.password,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        expect(response.body.user.email).to.eq(testUser.email);
        authToken = response.body.token;
      });
    });

    it('should reject login with invalid password', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: testUser.email,
          password: 'wrong_password',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.include('Invalid email or password');
      });
    });
  });

  describe('Protected Routes', () => {
    before(() => {
      // Login to get token before protected route tests
      cy.request('POST', '/api/auth/login', {
        email: testUser.email,
        password: testUser.password,
      }).then((response) => {
        authToken = response.body.token;
      });
    });

    it('should get current user profile', () => {
      cy.request({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq(testUser.email);
      });
    });

    it('should get all users', () => {
      cy.request({
        method: 'GET',
        url: '/api/auth/users',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.some((user: any) => user.email === testUser.email)).to.be.true;
      });
    });

    it('should get user by ID', () => {
      // First get current user to get the ID
      cy.request({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((meResponse) => {
        const userId = meResponse.body.id;

        // Then get user by ID
        cy.request({
          method: 'GET',
          url: `/api/auth/users/${userId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.eq(userId);
        });
      });
    });

    it('should reject unauthenticated requests to protected routes', () => {
      cy.request({
        method: 'GET',
        url: '/api/auth/me',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  after(() => {
    // Clean up - delete the test user (you might need to implement this endpoint)
    // This is optional and depends on your API
    cy.request({
      method: 'DELETE',
      url: '/api/auth/test-cleanup', // Example endpoint
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        email: testUser.email,
      },
    });
  });
});