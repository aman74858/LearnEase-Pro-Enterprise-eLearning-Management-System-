import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Video, ArrowLeft, Mic, MicOff, Camera, CameraOff, Monitor, LogOut, Users, Shield } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LiveClassRoomPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const fetchLiveClass = async () => {
      try {
        const res = await api.get(`/live-classes/${id}`);
        if (res.data?.success) {
          setLiveClass(res.data.liveClass);
        }
      } catch (err) {
        toast.error('Could not load live class.');
        navigate('/live-classes');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClass();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#0F1319] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#128F80] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Connecting to secure live room...</p>
        </div>
      </div>
    );
  }

  // Construct embedded Jitsi Meet URL with authenticated user name & config
  const jitsiUrl = `https://meet.jit.si/${liveClass?.meetingId || 'learnease-room'}#userInfo.displayName="${encodeURIComponent(user?.name || 'Student')}"`;

  return (
    <div className="min-h-screen bg-[#0F1319] text-white flex flex-col pt-16">
      {/* Top Session Bar */}
      <div className="bg-[#18202C] px-6 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/live-classes"
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <h1 className="font-heading font-bold text-sm sm:text-base text-white">
                {liveClass?.title}
              </h1>
            </div>
            <p className="text-[11px] text-gray-400">
              Host: {liveClass?.instructor?.name} • Room ID: {liveClass?.meetingId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs bg-gray-800/80 px-3 py-1.5 rounded-full text-emerald-400 border border-gray-700">
            <Shield className="w-3.5 h-3.5" />
            <span>Attendance Logged</span>
          </div>

          <Link
            to="/live-classes"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Session</span>
          </Link>
        </div>
      </div>

      {/* Main Video Frame: Embedded Jitsi Meeting */}
      <div className="flex-1 w-full bg-black relative flex items-center justify-center">
        <iframe
          src={jitsiUrl}
          title={liveClass?.title}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full border-none min-h-[calc(100vh-120px)]"
        ></iframe>
      </div>
    </div>
  );
};

export default LiveClassRoomPage;
