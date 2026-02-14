'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Send,
  User,
  Loader2
} from 'lucide-react';
import { getCurrentProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Proposal {
  id: string;
  job: {
    title: string;
  };
  vendor: {
    business_name: string;
    profile: {
      id: string;
      full_name: string;
    };
  };
}

const Chat = () => {
  const router = useRouter();
  const params = useParams();
  const proposalId = params?.proposalId as string;
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (profile && proposalId) {
      fetchProposalAndMessages();
      
      // Subscribe to new messages with proper realtime config
      const channel = supabase
        .channel(`messages:${proposalId}`, {
          config: {
            broadcast: { self: true },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `proposal_id=eq.${proposalId}`,
          },
          (payload) => {
            console.log('New message received:', payload);
            const newMsg = payload.new as Message;
            setMessages((current) => {
              // Avoid duplicates
              if (current.some(m => m.id === newMsg.id)) {
                return current;
              }
              return [...current, newMsg];
            });
            scrollToBottom();
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });

      return () => {
        console.log('Unsubscribing from channel');
        supabase.removeChannel(channel);
      };
    }
  }, [profile, proposalId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAuth = async () => {
    try {
      const userProfile = await getCurrentProfile();
      if (!userProfile) {
        router.push('/');
        return;
      }
      setProfile(userProfile);
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchProposalAndMessages = async () => {
    // Fetch proposal details
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        id,
        job:jobs!proposals_job_id_fkey (
          title
        ),
        vendor:vendors!proposals_vendor_id_fkey (
          business_name,
          profile:profiles!vendors_profile_id_fkey (
            id,
            full_name
          )
        )
      `)
      .eq('id', proposalId)
      .single();

    if (proposalError) {
      console.error('Error fetching proposal:', proposalError);
      return;
    }
    setProposal(proposalData as any);

    // Fetch messages
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return;
    }

    setMessages(messagesData || []);
    
    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('proposal_id', proposalId)
      .neq('sender_id', profile.id);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX
    setSending(true);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          proposal_id: proposalId,
          sender_id: profile.id,
          content: messageContent,
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
        setNewMessage(messageContent); // Restore message on error
        return;
      }

      console.log('Message sent successfully:', data);
      
      // Message will be added via realtime subscription
      // But add it immediately for better UX if realtime is slow
      if (data && !messages.some(m => m.id === data.id)) {
        setMessages(current => [...current, data]);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20 pb-4 px-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-t-2xl shadow-lg border border-orange-100 p-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
            {proposal?.vendor.business_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">
              {profile.user_type === 'vendor' 
                ? proposal?.job.title 
                : proposal?.vendor.business_name}
            </h2>
            <p className="text-sm text-gray-600">
              {profile.user_type === 'vendor'
                ? 'Chat with organizer'
                : proposal?.vendor.profile.full_name}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white border-x border-orange-100 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === profile.id;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="bg-white/90 backdrop-blur-md rounded-b-2xl shadow-lg border border-orange-100 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
