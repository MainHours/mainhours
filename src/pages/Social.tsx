import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import FeaturedPost from '@/components/dashboard/FeaturedPost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
const Social = () => {
  const isMobile = useIsMobile();
  const posts = [{
    username: "alex_morgan",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D",
    caption: "Beautiful day exploring the city! #cityscape #adventure",
    likes: 524,
    comments: 32,
    timeAgo: "2 hours ago"
  }, {
    username: "travel_enthusiast",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    imageUrl: "https://images.unsplash.com/photo-1682687982107-14492010e05e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8b2NlYW58ZW58MHx8MHx8fDA%3D",
    caption: "Ocean vibes 🌊 #beachlife #vacation",
    likes: 1024,
    comments: 76,
    timeAgo: "5 hours ago"
  }, {
    username: "foodie_gourmet",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    caption: "Homemade pasta with fresh ingredients from the local market. #foodporn #homecooking",
    likes: 783,
    comments: 42,
    timeAgo: "7 hours ago"
  }, {
    username: "nature_lover",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    imageUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlfGVufDB8fDB8fHww",
    caption: "Mother Nature at her finest. #hiking #naturelovers",
    likes: 892,
    comments: 53,
    timeAgo: "12 hours ago"
  }];
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Social Network</h1>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-muted">
                  <img alt="Your avatar" className="rounded-full" src="https://avatars.githubusercontent.com/u/124599?v=4" />
                </div>
                <Input placeholder="Share what's on your mind..." className="flex-grow" />
                <Button>Post</Button>
              </div>
            </div>
            
            <Tabs defaultValue="feed" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="feed" className="mt-0">
                <div className="space-y-6">
                  {posts.map((post, index) => <FeaturedPost key={index} {...post} />)}
                </div>
              </TabsContent>
              
              <TabsContent value="discover" className="mt-0">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">Discover content coming soon</h3>
                  <p className="text-muted-foreground">We're working on this feature!</p>
                </div>
              </TabsContent>
              
              <TabsContent value="following" className="mt-0">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">Following feed coming soon</h3>
                  <p className="text-muted-foreground">We're working on this feature!</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>;
};
export default Social;