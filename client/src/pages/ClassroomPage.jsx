import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  Download,
  Award,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const ClassroomPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'chat', 'resources', 'quiz'

  // Quiz State
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Chat State
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [userTyping, setUserTyping] = useState('');

  useEffect(() => {
    const fetchClassroomData = async () => {
      setLoading(true);
      try {
        const courseRes = await api.get(`/courses/${courseId}`);
        if (!courseRes.data?.success) {
          toast.error('Course not found');
          navigate('/courses');
          return;
        }

        const enrollRes = await api.get(`/enrollments/course/${courseRes.data.course._id}`);
        if (!enrollRes.data?.isEnrolled) {
          toast('You must enroll to view this classroom.', { icon: '🔒' });
          navigate(`/courses/${courseRes.data.course.slug}`);
          return;
        }

        setCourse(courseRes.data.course);
        setCurriculum(courseRes.data.curriculum || []);
        setEnrollment(enrollRes.data.enrollment);

        // Set default active lesson: first lesson or last accessed
        const allLessons = [];
        courseRes.data.curriculum.forEach((mod) => {
          if (mod.lessons) allLessons.push(...mod.lessons);
        });

        if (allLessons.length > 0) {
          const lastAccessed = allLessons.find(
            (l) => l._id === enrollRes.data.enrollment?.lastAccessedLesson
          );
          setActiveLesson(lastAccessed || allLessons[0]);
        }

        // Fetch Quizzes
        const quizRes = await api.get(`/quizzes/course/${courseRes.data.course._id}`);
        if (quizRes.data?.success && quizRes.data.quizzes.length > 0) {
          setQuizzes(quizRes.data.quizzes);
          setCurrentQuiz(quizRes.data.quizzes[0]);
        }

        // Fetch / Setup Chat Room
        const chatRes = await api.post(`/chat/course-room/${courseRes.data.course._id}`);
        if (chatRes.data?.success) {
          setChatRoom(chatRes.data.room);
          const msgRes = await api.get(`/chat/rooms/${chatRes.data.room._id}/messages`);
          if (msgRes.data?.success) {
            setMessages(msgRes.data.messages);
          }
        }
      } catch (err) {
        console.error('Error fetching classroom data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [courseId]);

  // Socket chat listeners
  useEffect(() => {
    if (!socket || !chatRoom?._id) return;

    socket.emit('join_room', chatRoom._id);

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user_typing', ({ userName }) => {
      setUserTyping(`${userName} is typing...`);
      setTimeout(() => setUserTyping(''), 2500);
    });

    return () => {
      socket.emit('leave_room', chatRoom._id);
      socket.off('receive_message');
      socket.off('user_typing');
    };
  }, [socket, chatRoom?._id]);

  const handleToggleLessonComplete = async (lessonId) => {
    const isAlreadyCompleted = enrollment?.completedLessons?.includes(lessonId);
    try {
      const res = await api.post(`/enrollments/course/${course._id}/progress`, {
        lessonId,
        isCompleted: !isAlreadyCompleted,
      });

      if (res.data?.success) {
        setEnrollment((prev) => ({
          ...prev,
          progressPercentage: res.data.progressPercentage,
          completedLessons: res.data.completedLessons,
          status: res.data.status,
          certificate: res.data.certificate || prev?.certificate,
        }));

        if (res.data.progressPercentage === 100) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
          toast.success('🎉 Congratulations! You have completed 100% of this course!');
        } else {
          toast.success(isAlreadyCompleted ? 'Lesson marked uncompleted' : 'Lesson completed!');
        }
      }
    } catch (err) {
      toast.error('Failed to update progress.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !chatRoom?._id) return;

    if (socket) {
      socket.emit('send_message', {
        roomId: chatRoom._id,
        senderId: user._id,
        senderName: user.name,
        senderAvatar: user.avatar,
        senderRole: user.role,
        text: messageInput.trim(),
      });
      setMessageInput('');
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuiz) return;

    const formattedAnswers = Object.keys(selectedAnswers).map((qIdx) => ({
      questionIndex: Number(qIdx),
      selectedOptionIndex: Number(selectedAnswers[qIdx]),
    }));

    setSubmittingQuiz(true);
    try {
      const res = await api.post(`/quizzes/${currentQuiz._id}/attempt`, {
        userAnswers: formattedAnswers,
      });

      if (res.data?.success) {
        setQuizResult(res.data);
        if (res.data.attempt?.passed) {
          confetti({ particleCount: 80, spread: 60 });
        }
      }
    } catch (err) {
      toast.error('Failed to submit quiz attempt.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#F5F7FA] dark:bg-[#0F1319]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#128F80] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Entering interactive classroom...</p>
        </div>
      </div>
    );
  }

  const isCurrentLessonCompleted = enrollment?.completedLessons?.includes(activeLesson?._id);

  return (
    <div className="pt-24 pb-12 bg-[#F5F7FA] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6">
        
        {/* Top Bar with Course Progress */}
        <div className="bg-white dark:bg-[#18202C] rounded-2xl p-4 mb-6 border border-gray-100 dark:border-gray-800 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to={`/courses/${course?.slug}`}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#128F80]">
                Now Playing
              </span>
              <h1 className="font-heading font-bold text-base sm:text-lg text-gray-900 dark:text-white line-clamp-1">
                {activeLesson?.title || course?.title}
              </h1>
            </div>
          </div>

          {/* Progress Bar & Certificate Pill */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-3">
              <div className="w-32 sm:w-48 bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#128F80] h-full rounded-full transition-all duration-500"
                  style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 shrink-0">
                {enrollment?.progressPercentage || 0}% Complete
              </span>
            </div>

            {enrollment?.progressPercentage === 100 && (
              <Link
                to="/dashboard/student/certificates"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#16A36A] text-white shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Award className="w-3.5 h-3.5" />
                Certificate Ready
              </Link>
            )}
          </div>
        </div>

        {/* Main Classroom Layout: Player (Left) + Curriculum & Discussion (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Video Player & Tabs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Video Box */}
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative flex items-center justify-center">
              <video
                key={activeLesson?._id}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={course?.thumbnail}
              >
                <source src={activeLesson?.videoUrl || course?.previewVideoUrl} type="video/mp4" />
                Your browser does not support HTML5 video streaming.
              </video>
            </div>

            {/* Video Controls & Lesson Completion Action */}
            <div className="bg-white dark:bg-[#18202C] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {activeLesson?.title}
                </h2>
                <p className="text-xs text-gray-500">
                  Duration: {activeLesson?.durationMinutes || 15} mins • {course?.category?.name}
                </p>
              </div>

              <button
                onClick={() => handleToggleLessonComplete(activeLesson?._id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all active:scale-95 shadow-sm ${
                  isCurrentLessonCompleted
                    ? 'bg-[#16A36A]/10 text-[#16A36A] border border-[#16A36A]/30'
                    : 'bg-[#128F80] hover:bg-[#087568] text-white shadow-card'
                }`}
              >
                {isCurrentLessonCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>
            </div>

            {/* Tabs Navigation: Overview, Discussion, Resources, Quiz */}
            <div className="bg-white dark:bg-[#18202C] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft overflow-hidden">
              <div className="flex border-b border-gray-100 dark:border-gray-800 px-6 pt-4 space-x-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3.5 transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === 'overview'
                      ? 'border-[#128F80] text-[#128F80]'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`pb-3.5 transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === 'chat'
                      ? 'border-[#128F80] text-[#128F80]'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Group Discussion
                  <span className="w-2 h-2 rounded-full bg-[#16A36A]"></span>
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`pb-3.5 transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === 'resources'
                      ? 'border-[#128F80] text-[#128F80]'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download Resources ({activeLesson?.resources?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-3.5 transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === 'quiz'
                      ? 'border-[#128F80] text-[#128F80]'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#F45B48]" />
                  Assessment Quiz
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{activeLesson?.description || course?.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-xs text-gray-400">
                      <span>Instructor: {course?.instructor?.name}</span>
                      <span>•</span>
                      <span>Language: {course?.language}</span>
                      <span>•</span>
                      <span>Level: {course?.level}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                      {messages.map((m) => {
                        const isMe = m.sender?._id === user?._id;
                        return (
                          <div
                            key={m._id || Math.random()}
                            className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                          >
                            <img
                              src={m.sender?.avatar || 'https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=80&q=80'}
                              alt="avatar"
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div
                              className={`max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm ${
                                isMe
                                  ? 'bg-[#128F80] text-white rounded-tr-none'
                                  : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-tl-none'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1 font-semibold">
                                <span>{m.sender?.name}</span>
                                {m.sender?.role === 'instructor' && (
                                  <span className="bg-amber-400/20 text-amber-500 px-1 rounded">Mentor</span>
                                )}
                              </div>
                              <p className="leading-relaxed">{m.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {userTyping && (
                      <p className="text-[11px] text-gray-400 italic mb-2">{userTyping}</p>
                    )}

                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => {
                          setMessageInput(e.target.value);
                          if (socket && chatRoom?._id) {
                            socket.emit('typing', { roomId: chatRoom._id, userName: user?.name });
                          }
                        }}
                        placeholder="Type a message or question for instructors..."
                        className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-3">
                    {activeLesson?.resources?.length > 0 ? (
                      activeLesson.resources.map((res, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-900"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#128F80]" />
                            <div>
                              <p className="text-xs font-bold text-gray-900 dark:text-white">{res.name}</p>
                              <span className="text-[10px] text-gray-400">{res.size || '1.5 MB'}</span>
                            </div>
                          </div>
                          <a
                            href={res.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#128F80]/10 text-[#128F80] hover:bg-[#128F80] hover:text-white transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 py-4 text-center">
                        No supplementary downloadable files attached to this specific lesson.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div>
                    {currentQuiz ? (
                      <div>
                        <div className="mb-6">
                          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-1">
                            {currentQuiz.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Passing Score: {currentQuiz.passingScorePercentage}% • {currentQuiz.questions?.length} Questions
                          </p>
                        </div>

                        {quizResult ? (
                          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-black bg-[#128F80]/10 text-[#128F80]">
                              {quizResult.attempt?.scorePercentage}%
                            </div>
                            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                              {quizResult.attempt?.passed ? '🎉 You Passed!' : 'Need More Review'}
                            </h4>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto">
                              {quizResult.message}
                            </p>
                            <button
                              onClick={() => {
                                setQuizResult(null);
                                setSelectedAnswers({});
                              }}
                              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#128F80] text-white hover:bg-[#087568] transition-all"
                            >
                              Retake Assessment
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleQuizSubmit} className="space-y-6">
                            {currentQuiz.questions?.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50"
                              >
                                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-3">
                                  {qIdx + 1}. {q.questionText}
                                </p>
                                <div className="space-y-2">
                                  {q.options?.map((opt, optIdx) => (
                                    <label
                                      key={optIdx}
                                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                                        selectedAnswers[qIdx] === optIdx
                                          ? 'border-[#128F80] bg-[#128F80]/5 font-semibold text-[#128F80]'
                                          : 'border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question_${qIdx}`}
                                        checked={selectedAnswers[qIdx] === optIdx}
                                        onChange={() =>
                                          setSelectedAnswers({
                                            ...selectedAnswers,
                                            [qIdx]: optIdx,
                                          })
                                        }
                                        className="text-[#128F80] focus:ring-[#128F80]"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <button
                              type="submit"
                              disabled={submittingQuiz}
                              className="px-6 py-3 rounded-xl font-heading font-bold text-xs bg-[#128F80] text-white hover:bg-[#087568] shadow-card transition-all"
                            >
                              {submittingQuiz ? 'Evaluating...' : 'Submit Answers & Calculate Score'}
                            </button>
                          </form>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 py-4 text-center">
                        No quiz available for this module yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Curriculum Navigation Drawer */}
          <div className="lg:col-span-4 bg-white dark:bg-[#18202C] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft sticky top-28">
            <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Course Curriculum</span>
              <span className="text-xs text-gray-400 font-normal">
                {enrollment?.completedLessons?.length || 0} / {curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} completed
              </span>
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {curriculum.map((mod, mIdx) => (
                <div key={mod._id} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800/80 font-heading font-bold text-xs text-gray-800 dark:text-gray-200">
                    {mod.title}
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {mod.lessons?.map((lesson) => {
                      const isActive = activeLesson?._id === lesson._id;
                      const isCompleted = enrollment?.completedLessons?.includes(lesson._id);

                      return (
                        <button
                          key={lesson._id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between text-xs transition-colors ${
                            isActive
                              ? 'bg-[#128F80]/10 font-bold text-[#128F80]'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                            ) : (
                              <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#128F80]' : 'text-gray-400'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                            {lesson.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
