describe('Course Management', () => {
  let authToken: string;

//   it('should create a new course', () => {
//     cy.request({
//       method: 'POST',
//       url: '/api/courses',
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: {
//         title: 'Test Course',
//         description: 'This is a test course',
//         instructor: 'Instructor',
//         price: 100,
//       }
//     })
//   })

  before(() => {
    // Login and get token before running tests
    cy.request('POST', '/api/auth/login', {
      email: 'instructor@test.com',
      password: 'password123',
    }).then((response) => {
      authToken = response.body.token;
    });
  });

  describe('Course CRUD Operations', () => {
    let courseId: number;

    it('should create a new course', () => {
      cy.request({
        method: 'POST',
        url: '/api/courses',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: {
          title: 'Cypress Test Course',
          description: 'This is a test course created by Cypress',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq('Cypress Test Course');
        courseId = response.body.id;
      });
    });

    it('should retrieve all courses', () => {
      cy.request('GET', '/api/courses').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.some((course: any) => course.id === courseId)).to.be.true;
      });
    });

    it('should retrieve a specific course by ID', () => {
      cy.request('GET', `/api/courses/${courseId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(courseId);
        expect(response.body).to.have.property('instructor');
      });
    });

    it('should update a course', () => {
      cy.request({
        method: 'PUT',
        url: `/api/courses/${courseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: {
          title: 'Updated Cypress Test Course',
          description: 'Updated description',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq('Updated Cypress Test Course');
      });
    });

    it('should retrieve courses by instructor', () => {
      // Assuming the instructor ID is 1 (from the auth token)
      cy.request('GET', '/api/courses/instructor/1').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.some((course: any) => course.id === courseId)).to.be.true;
      });
    });

    it('should delete a course', () => {
      cy.request({
        method: 'DELETE',
        url: `/api/courses/${courseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });

      // Verify the course is deleted
      cy.request({
        method: 'GET',
        url: `/api/courses/${courseId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Course Authorization', () => {
    let otherInstructorToken: string;
    let courseId: number;

    before(() => {
      // Create a course as the first instructor
      cy.request({
        method: 'POST',
        url: '/api/courses',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: {
          title: 'Authorization Test Course',
          description: 'Test course for authorization',
        },
      }).then((response) => {
        courseId = response.body.id;
      });

      // Login as a different instructor
      cy.request('POST', '/api/auth/login', {
        email: 'other_instructor@test.com',
        password: 'password123',
      }).then((response) => {
        otherInstructorToken = response.body.token;
      });
    });

    it('should prevent updating other instructor\'s course', () => {
      cy.request({
        method: 'PUT',
        url: `/api/courses/${courseId}`,
        headers: {
          Authorization: `Bearer ${otherInstructorToken}`,
        },
        body: {
          title: 'Unauthorized Update Attempt',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    it('should prevent deleting other instructor\'s course', () => {
      cy.request({
        method: 'DELETE',
        url: `/api/courses/${courseId}`,
        headers: {
          Authorization: `Bearer ${otherInstructorToken}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    after(() => {
      // Clean up - delete the test course
      cy.request({
        method: 'DELETE',
        url: `/api/courses/${courseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    });
  });
});