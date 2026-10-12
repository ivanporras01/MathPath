import { createRoot } from 'react-dom/client';
import MathPortal from '../app/portal';
import TeacherDashboard from '../app/teacher/teacher-dashboard';
import '../app/globals.css';
import './mathhub.css';
import '../app/mathhub.css';

const teacher = /^\/teacher\/?$/.test(window.location.pathname);
document.title = teacher ? 'MathHub · Teacher Dashboard' : 'MathHub · by Mr. Porras';
createRoot(document.getElementById('root')!).render(teacher ? <TeacherDashboard /> : <MathPortal />);
