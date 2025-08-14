import { Router } from 'express';
import CourseService from '../services/course.service';
import { authenticate } from '../middleware/auth.middleware';

const courseRouter = Router();

// Create a course
courseRouter.post('/', authenticate, async (req: any, res) => {
  try {
    const { title, description } = req.body;
    const instructorId = req.user.id; // from authenticated user
    const course = await CourseService.createCourse(title, description, instructorId);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courses
courseRouter.get('/', async (_req, res) => {
  try {
    const courses = await CourseService.getCourses();
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get a course by ID
courseRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const course = await CourseService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a course
courseRouter.put('/:id', authenticate, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Optionally, only allow instructor to update their own course
    const existingCourse = await CourseService.getCourseById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (existingCourse.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updates = req.body;
    const updatedCourse = await CourseService.updateCourse(id, updates);
    res.json(updatedCourse);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course
courseRouter.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Optionally, only allow instructor to delete their own course
    const existingCourse = await CourseService.getCourseById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (existingCourse.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    const deletedCourse = await CourseService.deleteCourse(id);
    res.json(deletedCourse);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get courses by instructor
courseRouter.get('/instructor/:instructorId', async (req, res) => {
  try {
    const instructorId = parseInt(req.params.instructorId, 10);
    const courses = await CourseService.getCoursesByInstructor(instructorId);
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default courseRouter;
