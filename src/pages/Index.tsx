import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-chat">
      {/* Main Content Area */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Cultural Heritage Explorer
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the rich history and cultural significance of heritage sites around the world. 
            Our AI assistant is here to guide you through historical monuments, archaeological wonders, 
            and cultural treasures that tell the story of human civilization.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-card rounded-lg border border-chat-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-chat-primary">Historical Sites</h3>
              <p className="text-sm text-muted-foreground">
                Explore ancient monuments, castles, and architectural marvels that have stood the test of time.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-chat-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-chat-primary">Archaeological Discoveries</h3>
              <p className="text-sm text-muted-foreground">
                Learn about excavation sites and artifacts that reveal insights into past civilizations.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-chat-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-chat-primary">Cultural Programs</h3>
              <p className="text-sm text-muted-foreground">
                Find educational tours, workshops, and programs that bring heritage sites to life.
              </p>
            </div>
          </div>
          <div className="mt-12 p-4 bg-chat-surface rounded-lg border border-chat-border">
            <p className="text-sm text-chat-text-secondary">
              👋 Need help exploring cultural heritage sites? Click the chat icon in the bottom-right corner to start a conversation with our Heritage Guide!
            </p>
          </div>
        </div>
      </div>

      {/* Chatbot Component */}
      <ChatBot />
    </div>
  );
};

export default Index;
