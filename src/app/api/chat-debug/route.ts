import { NextResponse } from 'next/server';

export async function GET() {
  const report: any = {
    timestamp: new Date().toISOString(),
    gemini: { configured: false, working: false },
    groq: { configured: false, working: false },
    openai: { configured: false, working: false },
    summary: ''
  };

  // 1. Test Google Gemini API
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    report.gemini.configured = true;
    report.gemini.keyFormat = geminiKey.length > 8 
      ? `${geminiKey.substring(0, 5)}...${geminiKey.substring(geminiKey.length - 4)}`
      : 'Định dạng key không hợp lệ';
    
    const configs = [
      { model: 'gemini-2.0-flash', version: 'v1beta' },
      { model: 'gemini-2.0-flash-lite', version: 'v1beta' },
      { model: 'gemini-1.5-flash', version: 'v1beta' },
      { model: 'gemini-1.5-pro', version: 'v1beta' },
    ];
    let geminiSuccess = false;
    const geminiErrors: any = {};

    for (const config of configs) {
      try {
        const url = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${geminiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        });
        const data = await res.json();
        if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          report.gemini.working = true;
          report.gemini.modelUsed = `${config.model} (${config.version})`;
          report.gemini.reply = data.candidates[0].content.parts[0].text.trim();
          geminiSuccess = true;
          break;
        } else {
          geminiErrors[`${config.model}_${config.version}`] = data;
        }
      } catch (e: any) {
        geminiErrors[`${config.model}_${config.version}`] = e.message;
      }
    }

    if (!geminiSuccess) {
      report.gemini.error = geminiErrors;
    }
  }

  // 2. Test Groq Cloud API
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    report.groq.configured = true;
    report.groq.keyFormat = groqKey.length > 8
      ? `${groqKey.substring(0, 7)}...${groqKey.substring(groqKey.length - 4)}`
      : 'Định dạng key không hợp lệ';
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        })
      });
      const data = await res.json();
      if (res.ok && data.choices?.[0]?.message?.content) {
        report.groq.working = true;
        report.groq.reply = data.choices[0].message.content.trim();
      } else {
        report.groq.error = data;
      }
    } catch (e: any) {
      report.groq.error = e.message;
    }
  }

  // 3. Test OpenAI API
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    report.openai.configured = true;
    report.openai.keyFormat = openaiKey.length > 8
      ? `${openaiKey.substring(0, 7)}...${openaiKey.substring(openaiKey.length - 4)}`
      : 'Định dạng key không hợp lệ';
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        })
      });
      const data = await res.json();
      if (res.ok && data.choices?.[0]?.message?.content) {
        report.openai.working = true;
        report.openai.reply = data.choices[0].message.content.trim();
      } else {
        report.openai.error = data;
      }
    } catch (e: any) {
      report.openai.error = e.message;
    }
  }

  // Formulate diagnostic summary
  const workingProviders = [];
  if (report.gemini.working) workingProviders.push('Google Gemini 🟢');
  if (report.groq.working) workingProviders.push('Groq Cloud 🟢');
  if (report.openai.working) workingProviders.push('OpenAI 🟢');

  if (workingProviders.length > 0) {
    report.summary = `Hệ thống sẵn sàng! Các nhà cung cấp hoạt động tốt: ${workingProviders.join(', ')}.`;
  } else {
    report.summary = `Không có nhà cung cấp API nào hoạt động. Chatbot tự động sử dụng Động cơ giả lập offline SeduAi Hybrid Engine v2 🔴.`;
  }

  return NextResponse.json(report);
}
