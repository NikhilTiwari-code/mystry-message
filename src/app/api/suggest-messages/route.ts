import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const questions = [
      "What's your favorite movie?",
      "Do you have any pets?",
      "What's your dream job?",
      "What's a hidden talent you have?",
      "What's the best advice you've ever received?",
      "If you could travel anywhere right now, where would it be?",
      "What is your favorite book of all time?",
      "What is a hobby you've always wanted to try?",
      "Who has been the biggest influence in your life?",
      "What is your favorite childhood memory?"
    ];
    
    // Return the questions as a single string separated by '||' to match the expected format
    // or just return them as is, depending on what the frontend expects.
    // Based on the deleted code, it expected '||' separated string.
    const questionsString = questions.join('||');

    return NextResponse.json({ 
      success: true, 
      message: questionsString 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Error fetching suggestions' 
    }, { status: 500 });
  }
}
