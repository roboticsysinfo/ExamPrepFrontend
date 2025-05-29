import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import RouteScrollToTop from "./helper/RouteScrollToTop";
import PrivateRoute from "./routes/PrivateRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";

// Pages
import HomePageSix from "./pages/HomePageSix";
import AddUserPage from "./pages/AddUserPage";
import AssignRolePage from "./pages/AssignRolePage";
import ErrorPage from "./pages/ErrorPage";
import NotificationPage from "./pages/NotificationPage";
import RoleAccessPage from "./pages/RoleAccessPage";
import SignInPage from "./pages/SignInPage";
import TermsConditionPage from "./pages/TermsConditionPage";
import StudentRegistrationPage from "./pages/StudentRegistrationPage";
import StudentsPage from "./pages/StudentsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentUpdatePage from "./pages/StudentUpdatePage";
import UpdateExamPage from "./pages/UpdateExamPage";
import CreateExamPage from "./pages/CreateExamPage";
import ExamsListPage from "./pages/ExamsListPage";
import CreateSubjectPage from "./pages/CreateSubjectPage";
import SubjectsPage from "./pages/SubjectsPage";
import CreateTopicPage from "./pages/CreateTopicPage";
import TopicsPage from "./pages/TopicsPage";
import AccessDeniedPage from "./pages/AccessDeniedPage"; // create this page
import CreateQuestionPage from "./pages/CreateQuestionPage";
import QuestionManager from "./components/QuestionManager";
import QuestionsPage from "./pages/QuestionsPage";
import CreateTestPage from "./pages/CreateTestPage";
import TestsListPage from "./pages/TestsListPage";
import EditTestPage from "./pages/EditTestPage";

function App() {

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (

    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>

        {/* Public Routes */}
        <Route exact path="/login" element={<SignInPage />} />
        <Route exact path="/terms-condition" element={<TermsConditionPage />} />
        <Route exact path="/access-denied" element={<AccessDeniedPage />} />

        {/* Protected Routes */}

        <Route
          path="/"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'teacher']} pageKey="home">
                <HomePageSix />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/student-registration"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'teacher']} pageKey="student-registration">
                <StudentRegistrationPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/students"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'teacher']} pageKey="students">
                <StudentsPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/student/view/:id"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'teacher']} pageKey="student-profile">
                <StudentProfilePage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/student/edit/:id"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="student-edit">
                <StudentUpdatePage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/create-exam"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="create-exam">
                <CreateExamPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'teacher']} pageKey="exams">
                <ExamsListPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/exam/edit/:id"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="edit-exam">
                <UpdateExamPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/create-subject"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="create-subject">
                <CreateSubjectPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'teacher']} pageKey="subjects">
                <SubjectsPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/create-topic"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="create-topic">
                <CreateTopicPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/topics"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'teacher']} pageKey="topics">
                <TopicsPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/create-question"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="create-question">
                <CreateQuestionPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/questions"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="questions">
                <QuestionsPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/create-test"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="create-test">
                <CreateTestPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/tests"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="tests">
                <TestsListPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/test/edit/:id"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="edit-test">
                <EditTestPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/add-user"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['super-admin']} pageKey="add-user">
                <AddUserPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/assign-role"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['super-admin']} pageKey="assign-role">
                <AssignRolePage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        {/* Admin + Super Admin Route */}
        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="notification">
                <NotificationPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/role-access"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin']} pageKey="role-access">
                <RoleAccessPage />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
