import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { NavigationProps } from '../types';
import { ArrowLeft, User, Lock, Save } from 'lucide-react';
import { authService } from '../src/services/auth.service';

export const Profile: React.FC<NavigationProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    brokerage: '',
    phone: '',
    address: '',
    city: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        setProfileData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          brokerage: response.data.brokerage || '',
          phone: response.data.profile?.phone || '',
          address: response.data.profile?.address || '',
          city: response.data.profile?.city || '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.updateProfile(profileData);
      setSuccess('Profile updated successfully!');
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-luxury-black flex items-center justify-center relative overflow-hidden px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#D9A44120,_transparent_40%)] opacity-40 pointer-events-none"></div>
      
      <div ref={contentRef} className="w-full max-w-4xl relative z-10">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="group flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors uppercase text-xs tracking-widest font-bold"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="glass-panel p-10 md:p-14 rounded-sm border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                activeTab === 'profile'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <User size={18} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                activeTab === 'password'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Lock size={18} />
              Change Password
            </button>
          </div>

          {user && (
            <div className="mb-8 p-4 bg-white/5 rounded border border-white/10">
              <p className="text-white/60 text-sm mb-2">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm">
              {success}
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                />
                <Input 
                  label="Last Name" 
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                />
              </div>
              <Input 
                label="Brokerage / Agency" 
                type="text"
                value={profileData.brokerage}
                onChange={(e) => setProfileData({ ...profileData, brokerage: e.target.value })}
              />
              <Input 
                label="Phone" 
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
              <Input 
                label="Address" 
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
              <Input 
                label="City" 
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
              />
              
              <div className="pt-6">
                <Button className="w-full flex justify-center" type="submit" disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input 
                label="Current Password" 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
              <Input 
                label="New Password" 
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
              <Input 
                label="Confirm New Password" 
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
              
              <div className="pt-6">
                <Button className="w-full flex justify-center" type="submit" disabled={loading}>
                  <Lock size={16} className="mr-2" />
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

