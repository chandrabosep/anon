import React from "react";
import { BarChart3, Building2, Eye, Lock, MessageSquare, Shield, Users } from "lucide-react";
import { Pixelify_Sans } from "next/font/google";

const font = Pixelify_Sans({
  subsets: ["latin"],
  weight: "400",
});

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
      <Icon className="w-8 h-8 text-blue-600 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

function App() {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="container mx-auto px-4 flex flex-col gap-y-10">
          <div className="flex flex-col items-center justify-center">
            <h1 className={`${font.className} text-4xl font-bold text-center mb-4 text-white`}>Insight Anon</h1>
            <p className={`text-xl text-center mb-8 text-white`}>
              Empower your organization with anonymous feedback and secure data sharing powered by iExec
            </p>
         </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={Shield}
              title="Complete Anonymity"
              description="Submit feedback without fear - our platform ensures total anonymity while maintaining accountability."
            />
            <FeatureCard
              icon={Lock}
              title="Powered by iExec"
              description="Leverage blockchain technology for secure data protection and controlled access to insights."
            />
            <FeatureCard
              icon={Users}
              title="Organization Collections"
              description="Create dedicated spaces for your company where employees can freely share their thoughts."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Open Communication"
              description="Enable transparent discussions while protecting individual identities."
            />
            <FeatureCard
              icon={BarChart3}
              title="Sentiment Analysis"
              description="Track organizational health through advanced analysis of feedback patterns."
            />
            <FeatureCard
              icon={Eye}
              title="Transparent Resolution"
              description="Approved insights become visible to all members, fostering a culture of openness."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
