
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Camera, ImagePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
      
      // Fetch profile data that might not be in user metadata
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          if (data) {
            setUsername(data.username || '');
          }
        } catch (error: any) {
          console.error('Error fetching profile:', error);
        }
      };
      
      fetchProfile();
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsDialogOpen(true);
    
    // Reset file input so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleAvatarUpload = async () => {
    if (!previewUrl) return;
    
    try {
      setLoading(true);
      
      // Convert data URL to blob
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      
      const fileExt = blob.type.split('/')[1];
      const fileName = `${Math.random().toString(36).slice(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user metadata with new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success('Avatar updated successfully');
      
      // Clean up and close dialog
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(`Avatar upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsDialogOpen(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (updateError) throw updateError;
      
      // Update profile table with username if it exists
      if (username) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: user?.id,
            username,
            full_name: fullName,
            avatar_url: avatarUrl
          });
          
        if (profileError) throw profileError;
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Profile Information</h2>
      
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        <div className="relative group">
          <Avatar className="w-24 h-24 cursor-pointer border-2 border-transparent group-hover:border-primary transition-all" onClick={handleAvatarClick}>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={fullName} />
            ) : (
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            )}
          </Avatar>
          <div 
            className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Button 
            variant="outline" 
            className="cursor-pointer"
            onClick={handleAvatarClick}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Change Avatar
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Recommended: Square JPG or PNG, at least 500x500px
          </p>
        </div>
      </div>
      
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />
          <p className="text-sm text-muted-foreground">
            Your username appears on your profile page and in your posts
          </p>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>

      {/* Image Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Picture Preview</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {previewUrl && (
              <div className="relative w-40 h-40 rounded-full overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleCancelUpload}>
                Cancel
              </Button>
              <Button onClick={handleAvatarUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
