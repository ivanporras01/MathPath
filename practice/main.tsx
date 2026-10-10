import { createRoot } from 'react-dom/client';
import MathPortal from '../app/portal';
import TeacherDashboard from '../app/teacher/teacher-dashboard';
import '../app/globals.css';
import './mathpath.css';

const teacher = /^\/teacher\/?$/.test(window.location.pathname);
document.title = teacher ? 'MathPath · Teacher Dashboard' : 'MathPath · Learn with Mr. Porras';
createRoot(document.getElementById('root')!).render(teacher ? <TeacherDashboard /> : <MathPortal />);
