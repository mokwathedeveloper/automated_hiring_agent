-- Seed data for development and testing
-- Run this after schema.sql

-- Insert sample subscription plans data (for reference)
-- Note: This is just for documentation, actual plans are handled in the application

-- Sample user data (will be created via Supabase Auth)
-- Users will be automatically created when they sign up via magic link

-- Sample resume analysis data structure (for reference)
-- This shows the expected JSONB structure for analysis field in resumes table

/*
Example analysis JSONB structure:
{
  "overall_score": 85,
  "sections": {
    "contact_info": {
      "score": 90,
      "found": ["email", "phone", "linkedin"],
      "missing": ["github"]
    },
    "skills": {
      "score": 80,
      "technical_skills": ["JavaScript", "Python", "React"],
      "soft_skills": ["Communication", "Leadership"],
      "recommendations": ["Add more specific technical skills", "Include certifications"]
    },
    "experience": {
      "score": 85,
      "years_of_experience": 5,
      "relevant_experience": true,
      "career_progression": "good",
      "recommendations": ["Quantify achievements with numbers", "Add more recent projects"]
    },
    "education": {
      "score": 75,
      "degree_level": "bachelor",
      "relevant_field": true,
      "recommendations": ["Consider adding relevant certifications"]
    }
  },
  "keywords": {
    "found": ["react", "javascript", "api", "database"],
    "missing": ["typescript", "aws", "docker"],
    "density": 0.15
  },
  "formatting": {
    "score": 90,
    "issues": [],
    "recommendations": ["Good formatting overall"]
  },
  "ats_compatibility": {
    "score": 88,
    "issues": ["Some special characters in contact section"],
    "recommendations": ["Use standard fonts", "Avoid complex formatting"]
  }
}
*/

-- Insert default subscription limits
INSERT INTO public.users (id, email, full_name, subscription_tier, resume_analyses_limit)
VALUES 
  -- These will be replaced by actual user signups
  ('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Demo User', 'free', 5)
ON CONFLICT (id) DO NOTHING;

-- Sample WhatsApp session structure (for reference)
/*
Example whatsapp_sessions.session_data JSONB structure:
{
  "current_step": "waiting_for_resume",
  "conversation_history": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "user_message",
      "content": "Hi, I want to analyze my resume"
    },
    {
      "timestamp": "2024-01-15T10:30:05Z",
      "type": "bot_response", 
      "content": "Great! Please send me your resume as a PDF or image."
    }
  ],
  "resume_count": 0,
  "last_analysis_id": null,
  "preferences": {
    "language": "en",
    "notification_enabled": true
  }
}
*/