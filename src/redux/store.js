import { configureStore } from '@reduxjs/toolkit';
import studentReducer from "../redux/slices/studentSlice"
import examReducer from "../redux/slices/examSlice";
import subjectReducer from "../redux/slices/subjectSlice";
import topicReducer from "../redux/slices/topicSlice";
import authReducer from "../redux/slices/authSlice";
import questionReducer from "../redux/slices/questionSlice";
import testReducer from "../redux/slices/testSlice";


const store = configureStore({

  reducer: {
    student: studentReducer,
    exam: examReducer,
    subject: subjectReducer,
    topics: topicReducer,
    auth: authReducer,
    questions: questionReducer,
    test: testReducer
  },

});


export default store;
