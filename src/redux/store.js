import { configureStore } from '@reduxjs/toolkit';
import studentReducer from "../redux/slices/studentSlice"
import examReducer from "../redux/slices/examSlice";
import subjectReducer from "../redux/slices/subjectSlice";
import topicReducer from "../redux/slices/topicSlice";
import authReducer from "../redux/slices/authSlice";
import questionReducer from "../redux/slices/questionSlice";
import testReducer from "../redux/slices/testSlice";
import examCategoryReducer from "../redux/slices/exanCategorySlice";
import instituteReducer from "../redux/slices/instituteSlice";
import userReducer from "../redux/slices/userSlice";
import admissionQueryReducer from "../redux/slices/admissionQuerySlice";
import previousQuestionPaperReducer from "../redux/slices/previousQuestionPaperSlice";
import practiceTestsReducer from "../redux/slices/practiceTestSlice"


const store = configureStore({

  reducer: {
    student: studentReducer,
    exam: examReducer,
    subject: subjectReducer,
    topics: topicReducer,
    auth: authReducer,
    questions: questionReducer,
    test: testReducer,
    examCategory: examCategoryReducer,
    institute: instituteReducer,
    user: userReducer,
    admissionQuery: admissionQueryReducer,
    previousQuestionPaper: previousQuestionPaperReducer,
    practiceTests: practiceTestsReducer
  },

});


export default store;
