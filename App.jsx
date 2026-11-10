import React, { useState, useEffect, useRef } from 'react';
import {
  Utensils,
  Bot,
  User,
  Send,
  Refrigerator,
  Flame,
  Heart,
  Settings,
  Sparkles,
  Clock,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  BookOpen,
  Award,
  RefreshCw,
  Search,
  Key,
  ShieldAlert,
  Zap,
  TrendingUp,
  Scale
} from 'lucide-react';

// Mock Knowledge Base for realistic local responses when API Key is absent
const MOCK_RECIPE_DATABASE = [
  {
    keywords: ['계란', '파', '달걀', '대파', '계란볶음밥', '볶음밥'],
    title: '백종원표 파기름 계란볶음밥',
    time: '10분',
    difficulty: '쉬움',
    calories: '450 kcal',
    tags: ['초간단', '자취요리', '인기'],
    ingredients: ['밥 1공기', '계란 2개', '대파 1대', '굴소스 1큰술', '식용유 2큰술', '소금 약간'],
    steps: [
      '대파는 얇게 송송 쓸어 준비하고, 계란 2개는 미리 그릇에 풀어놓습니다.',
      '팬에 식용유를 두르고 대파를 넣어 노릇해질 때까지 파기름을 만듭니다.',
      '파를 한쪽으로 밀고 계란을 부어 스크램블 에그를 만듭니다.',
      '간장이나 굴소스 1큰술을 눌려 불맛을 낸 뒤 밥을 넣고 센 불에 빠르게 볶아 완성합니다.'
    ]
  },
  {
    keywords: ['김치', '돼지고기', '김치찌개', '찌개', '국물'],
    title: '푹 끓인 돼지고기 푹신 김치찌개',
    time: '25분',
    difficulty: '보통',
    calories: '380 kcal',
    tags: ['한식', '국물요리', '밥도둑'],
    ingredients: ['신김치 200g', '돼지고기(목살/삼겹살) 150g', '두부 1/2모', '대파 1/2대', '마늘 1큰술', '고춧가루 1큰술'],
    steps: [
      '냄비에 돼지고기와 쌀뜨물(또는 물 500ml)을 넣고 푹 끓여 육수를 냅니다.',
      '고기가 익어갈 때 먹기 좋게 썬 신김치를 넣고 중불에서 15분 이상 푹 끓입니다.',
      '고춧가루, 다진 마늘로 간을 맞추고 두부와 대파를 올립니다.',
      '약불로 줄여 5분간 더 뭉근하게 끓여서 완성합니다.'
    ]
  },
  {
    keywords: ['닭가슴살', '다이어트', '단백질', '고단백', '샐러드', '식단'],
    title: '아보카도 닭가슴살 파워 샐러드',
    time: '15분',
    difficulty: '쉬움',
    calories: '320 kcal',
    tags: ['고단백', '다이어트', '클린식단'],
    ingredients: ['닭가슴살 150g', '아보카도 1/2개', '어린잎 채소 80g', '방울토마토 5개', '올리브유 1큰술', '오리엔탈 드레싱'],
    steps: [
      '닭가슴살은 결대로 찢거나 깍둑썰어 팬에 올리브유를 두르고 노릇하게 구워줍니다.',
      '아보카도는 씨를 제거하고 한입 크기로 슬라이스합니다.',
      '볼에 깨끗이 씻은 어린잎 채소와 반으로 썬 방울토마토를 담습니다.',
      '구운 닭가슴살과 아보카도를 얹고 오리엔탈 드레싱을 곁들여 완성합니다.'
    ]
  },
  {
    keywords: ['비', '비오는날', '부침개', '전', '파전', '김치전'],
    title: '바삭바삭 해물 파전',
    time: '20분',
    difficulty: '보통',
    calories: '420 kcal',
    tags: ['비오는날', '안주', '바삭'],
    ingredients: ['쪽파 100g', '오징어/새우 100g', '부침가루 1컵', '찬물 1컵', '계란 1개', '홍고추 1개'],
    steps: [
      '부침가루와 찬물을 1:1 비율로 섞어 약간 묽은 반죽을 만듭니다.',
      '쪽파는 팬 길이에 맞춰 손질하고, 해산물은 먹기 좋게 손질합니다.',
      '기름을 넉넉히 두른 팬에 쪽파를 깔고 반죽을 부어준 뒤 해산물을 올립니다.',
      '반죽이 80% 익으면 계란물을 위에 풀고 뒤집어 바삭하게 구워냅니다.'
    ]
  },
  {
    keywords: ['5분', '초간단', '야식', '라면', '투움바'],
    title: '치즈 신라면 투움바 라면',
    time: '7분',
    difficulty: '매우 쉬움',
    calories: '550 kcal',
    tags: ['초간단', '퓨전', '별미'],
    ingredients: ['매운 라면 1봉지', '우유 200ml', '체다치즈 2장', '다진마늘 0.5큰술', '버터 10g'],
    steps: [
      '냄비에 버터 10g과 다진마늘을 넣고 향이 나도록 볶아줍니다.',
      '우유 200ml를 붓고 끓어오르면 라면 스프 2/3와 면을 넣습니다.',
      '면이 알맞게 익어갈 때 체다치즈 2장을 올리고 꾸덕해질 때까지 저어줍니다.',
      '파슬리나 후추를 톡톡 털어 넣어 고소하고 매콤한 투움바를 즐깁니다.'
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'fridge', 'macro', 'favorites'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '안녕하세요! 오늘의 식사 요정 🍳입니다. 오늘 어떤 음식을 찾고 계신가요? 냉장고에 있는 재료를 알려주시거나 기분을 말해주시면 딱 맞는 레시피를 제안해 드릴게요!',
      recipe: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Settings / API Key
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Fridge Manager State
  const [fridgeIngredients, setFridgeIngredients] = useState(['계란', '대파', '김치', '두부', '양파']);
  const [newIngredient, setNewIngredient] = useState('');

  // Favorites State
  const [favorites, setFavorites] = useState([]);

  // Macro Calculator State
  const [macroInput, setMacroInput] = useState({
    weight: 65,
    height: 172,
    age: 26,
    gender: 'female',
    activity: 'moderate',
    goal: 'diet'
  });
  const [macroResult, setMacroResult] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Quick Chips
  const handleQuickPrompt = (promptText) => {
    setInputQuery(promptText);
    handleSendMessage(promptText);
  };

  // Add Fridge Ingredient
  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;
    if (!fridgeIngredients.includes(newIngredient.trim())) {
      setFridgeIngredients([...fridgeIngredients, newIngredient.trim()]);
    }
    setNewIngredient('');
  };

  const handleRemoveIngredient = (item) => {
    setFridgeIngredients(fridgeIngredients.filter((i) => i !== item));
  };

  // Toggle Favorites
  const toggleFavorite = (recipe) => {
    const exists = favorites.some((f) => f.title === recipe.title);
    if (exists) {
      setFavorites(favorites.filter((f) => f.title !== recipe.title));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  // Bot Logic Engine
  const generateBotResponse = async (userText) => {
    // If API Key is configured, attempt real Gemini/OpenAI Call
    if (apiKey.trim()) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are "오늘의 식사 요정 🍳", a friendly Korean meal recommendation AI. Format output in JSON if recipe is generated: { "text": "...", "recipe": { "title": "...", "time": "...", "difficulty": "...", "calories": "...", "tags": [...], "ingredients": [...], "steps": [...] } }'
              },
              { role: 'user', content: userText }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return {
            text: parsed.text || '추천 레시피를 준비했어요!',
            recipe: parsed.recipe || null
          };
        }
      } catch (e) {
        console.warn('API Error, falling back to smart local engine', e);
      }
    }

    // Smart Local Rule Engine Fallback
    await new Promise((r) => setTimeout(r, 900));

    const lower = userText.toLowerCase();

    // Check Fridge query
    if (lower.includes('냉장고') || lower.includes('파먹기') || lower.includes('재료')) {
      const available = fridgeIngredients.join(', ');
      return {
        text: `현재 냉장고에 보유 중인 [${available}] 재료들을 활용해서 만들어볼 수 있는 근사한 요리입니다!`,
        recipe: MOCK_RECIPE_DATABASE[0] // 계란 볶음밥
      };
    }

    // Check Weather / Mood
    if (lower.includes('비') || lower.includes('우울') || lower.includes('기분')) {
      return {
        text: '마음이 울적하거나 비 오는 날에는 따뜻하고 바삭한 전 요리가 제격이죠! 기분을 전환시켜 줄 추천 레시피예요.',
        recipe: MOCK_RECIPE_DATABASE[3] // 해물파전
      };
    }

    // Check High Protein / Diet
    if (lower.includes('다이어트') || lower.includes('단백질') || lower.includes('식단') || lower.includes('운동')) {
      return {
        text: '건강한 칼로리와 풍부한 단백질을 챙길 수 있는 클린 식단 레시피입니다. 부담 없이 맛있게 즐겨보세요!',
        recipe: MOCK_RECIPE_DATABASE[2] // 닭가슴살 샐러드
      };
    }

    // Check 5-min quick meal
    if (lower.includes('5분') || lower.includes('야식') || lower.includes('간단') || lower.includes('바쁠')) {
      return {
        text: '출출할 때 fast&easy! 단 7분 만에 완성되는 입맛 돋우는 별미 요리를 추천해 드립니다.',
        recipe: MOCK_RECIPE_DATABASE[4] // 투움바 라면
      };
    }

    // Keyword match scan
    const matched = MOCK_RECIPE_DATABASE.find((item) =>
      item.keywords.some((kw) => lower.includes(kw))
    );

    if (matched) {
      return {
        text: `'${matched.title}'은(는) 요구하신 분위기나 재료에 딱 맞는 최고의 선택입니다!`,
        recipe: matched
      };
    }

    // Default fallback random selection
    const randomRecipe = MOCK_RECIPE_DATABASE[Math.floor(Math.random() * MOCK_RECIPE_DATABASE.length)];
    return {
      text: `요청하신 조건과 어울리는 맛있는 식사 아이디어를 골라봤어요! 마음에 드실까요?`,
      recipe: randomRecipe
    };
  };

  // Send Message Flow
  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    const botResult = await generateBotResponse(text);

    const botMsg = {
      id: Date.now() + 1,
      sender: 'bot',
      text: botResult.text,
      recipe: botResult.recipe,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  // Calculate Daily Macros
  const calculateMacros = (e) => {
    e.preventDefault();
    const { weight, height, age, gender, activity, goal } = macroInput;
    let bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
    
    let activityMult = 1.2;
    if (activity === 'moderate') activityMult = 1.55;
    if (activity === 'active') activityMult = 1.75;

    let tdee = bmr * activityMult;

    if (goal === 'diet') tdee -= 400;
    if (goal === 'muscle') tdee += 300;

    const protein = Math.round((tdee * 0.3) / 4);
    const carbs = Math.round((tdee * 0.4) / 4);
    const fat = Math.round((tdee * 0.3) / 9);

    setMacroResult({
      calories: Math.round(tdee),
      protein,
      carbs,
      fat
    });
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-4 md:p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
              🍳
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-base text-slate-100 leading-tight">식사 요정 AI</h1>
              <p className="text-xs text-amber-400 font-medium">Smart Recipe Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'chat'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Bot className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">AI 식단 챗봇</span>
            </button>

            <button
              onClick={() => setActiveTab('fridge')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'fridge'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Refrigerator className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">냉장고 관리</span>
              <span className="hidden md:flex ml-auto bg-slate-800 text-xs text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {fridgeIngredients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('macro')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'macro'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Scale className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">칼로리/영양 계산기</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'favorites'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Heart className="w-5 h-5 shrink-0 text-rose-500" />
              <span className="hidden md:inline">즐겨찾기 레시피</span>
              {favorites.length > 0 && (
                <span className="hidden md:flex ml-auto bg-rose-500/20 text-rose-300 text-xs px-2 py-0.5 rounded-full font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* API Settings Bottom Switch */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">API 설정</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 relative">
        {/* Settings Modal Overlay */}
        {showSettings && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-100">API 연동 설정</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                OpenAI API Key를 입력하시면 더 정교한 실시간 생성 모델을 사용할 수 있습니다. 
                미입력 시 내장된 스마트 알고리즘 엔진으로 즉시 동작합니다.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">OpenAI API Key</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl transition-all text-sm"
                >
                  저장하고 닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: AI Chat Assistant */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full">
            {/* Top Bar Header */}
            <header className="px-6 py-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h2 className="font-semibold text-sm text-slate-100">식사 요정 AI와 대화 중</h2>
                  <p className="text-xs text-slate-400">무엇이든 물어보세요! (재료, 기분, 날씨, 다이어트 등)</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: Date.now(),
                      sender: 'bot',
                      text: '대화가 초기화되었습니다. 새로운 식단이나 음식을 추천해 드릴까요?',
                      recipe: null,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ])
                }
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all text-xs flex items-center gap-1.5"
                title="대화 리셋"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">초기화</span>
              </button>
            </header>

            {/* Scrollable Message List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 md:gap-4 max-w-3xl ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-5 h-5" /> : '🍳'}
                  </div>

                  {/* Message Bubble Content */}
                  <div className={`space-y-3 max-w-[85%] md:max-w-[75%]`}>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Rich Recipe Card inside Bot Message */}
                    {msg.recipe && (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                                추천 레시피
                              </span>
                              {msg.recipe.tags?.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">{msg.recipe.title}</h3>
                          </div>
                          <button
                            onClick={() => toggleFavorite(msg.recipe)}
                            className={`p-2 rounded-xl border transition-all ${
                              favorites.some((f) => f.title === msg.recipe.title)
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
                            }`}
                            title="즐겨찾기 저장"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        {/* Metadata badges */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 text-xs">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>{msg.recipe.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Flame className="w-4 h-4 text-rose-400" />
                            <span>{msg.recipe.calories}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Award className="w-4 h-4 text-emerald-400" />
                            <span>난이도: {msg.recipe.difficulty}</span>
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-amber-400" /> 필요 재료
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.recipe.ingredients.map((ing, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs border border-slate-700/60"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Cooking Steps */}
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> 조리 과정
                          </h4>
                          <ol className="space-y-2 text-xs text-slate-300">
                            {msg.recipe.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="font-bold text-amber-400 shrink-0">{idx + 1}.</span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-500 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Loader Indicator */}
              {isLoading && (
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-sm font-bold shadow-md">
                    🍳
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleQuickPrompt('냉장고에 있는 재료로 만들 수 있는 요리 추천해줘')}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <Refrigerator className="w-3.5 h-3.5 text-emerald-400" /> 냉장고 파먹기 🥬
              </button>
              <button
                onClick={() => handleQuickPrompt('비 오는 날 생각나는 따뜻한 음식 알려줘')}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> 오늘 뭐 먹지? (날씨/기분) 🌧️
              </button>
              <button
                onClick={() => handleQuickPrompt('고단백 다이어트용 건강 식단 추천해줘')}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" /> 다이어트/고단백 식단 💪
              </button>
              <button
                onClick={() => handleQuickPrompt('야식으로 먹기 좋은 초간단 5분 요리 알려줘')}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" /> 초간단 5분 요리 ⏱️
              </button>
            </div>

            {/* Bottom Message Input Field */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <input
                  type="text"
                  placeholder="예: 김치랑 돼지고기 있어, 다이어트 점심 추천해줘..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold p-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Fridge Ingredient Manager */}
        {activeTab === 'fridge' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Refrigerator className="w-6 h-6 text-emerald-400" /> 스마트 냉장고 재료 관리
              </h2>
              <p className="text-xs text-slate-400">
                현재 집 냉장고에 보유 중인 식재료를 등록해보세요. 등록된 재료를 기반으로 맞춰 맞춤형 요리를 추천해드립니다.
              </p>
            </div>

            {/* Input form for adding ingredients */}
            <form onSubmit={handleAddIngredient} className="flex gap-2">
              <input
                type="text"
                placeholder="새로운 재료 입력 (예: 대파, 버섯, 차돌박이)"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> 재료 추가
              </button>
            </form>

            {/* Current Fridge Ingredients List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center justify-between">
                <span>보유 중인 재료 리스트</span>
                <span className="text-xs text-amber-400">총 {fridgeIngredients.length}개</span>
              </h3>

              {fridgeIngredients.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  등록된 재료가 없습니다. 상단에서 재료를 추가해주세요!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {fridgeIngredients.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs"
                    >
                      🥬 {item}
                      <button
                        onClick={() => handleRemoveIngredient(item)}
                        className="text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Button to Recommend Recipes from Fridge */}
            <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-100 mb-1">이 재료들로 레시피 조합하기!</h4>
                <p className="text-xs text-slate-400">
                  현재 등록된 [{fridgeIngredients.slice(0, 4).join(', ')}...] 재료로 챗봇에게 즉시 추천을 요청합니다.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleQuickPrompt(`내 냉장고 재료 [${fridgeIngredients.join(', ')}]로 만들 요리 추천해줘`);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all whitespace-nowrap shadow-lg shadow-amber-500/20"
              >
                레시피 추천받기 ✨
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Calorie & Macro Target Calculator */}
        {activeTab === 'macro' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Scale className="w-6 h-6 text-amber-400" /> 일일 목표 영양 성분 계산기
              </h2>
              <p className="text-xs text-slate-400">
                신체 스펙과 목표를 입력하여 권장 칼로리 및 탄·단·지 영양소 비율을 계산해보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Input */}
              <form onSubmit={calculateMacros} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">체중 (kg)</label>
                    <input
                      type="number"
                      value={macroInput.weight}
                      onChange={(e) => setMacroInput({ ...macroInput, weight: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">신장 (cm)</label>
                    <input
                      type="number"
                      value={macroInput.height}
                      onChange={(e) => setMacroInput({ ...macroInput, height: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">나이</label>
                    <input
                      type="number"
                      value={macroInput.age}
                      onChange={(e) => setMacroInput({ ...macroInput, age: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">성별</label>
                    <select
                      value={macroInput.gender}
                      onChange={(e) => setMacroInput({ ...macroInput, gender: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="female">여성</option>
                      <option value="male">남성</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">목표</label>
                  <select
                    value={macroInput.goal}
                    onChange={(e) => setMacroInput({ ...macroInput, goal: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="diet">다이어트 (체지방 감량)</option>
                    <option value="maintain">체중 유지</option>
                    <option value="muscle">근성장 (체중 증가)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition-all"
                >
                  권장 영양소 계산하기
                </button>
              </form>

              {/* Results Display */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> 일일 권장 섭취 가이드
                  </h3>

                  {macroResult ? (
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="text-xs text-slate-400">목표 일일 칼로리</span>
                        <div className="text-3xl font-extrabold text-amber-400 mt-1">
                          {macroResult.calories} <span className="text-sm font-normal text-slate-400">kcal</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block">탄수화물 (40%)</span>
                          <span className="text-base font-bold text-slate-100">{macroResult.carbs}g</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block">단백질 (30%)</span>
                          <span className="text-base font-bold text-emerald-400">{macroResult.protein}g</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block">지방 (30%)</span>
                          <span className="text-base font-bold text-rose-400">{macroResult.fat}g</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-12 text-center">
                      좌측에서 수치를 입력하고 [계산하기] 버튼을 누르시면 맞춤 영양 가이드가 표시됩니다.
                    </p>
                  )}
                </div>

                {macroResult && (
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleQuickPrompt(`하루 ${macroResult.calories}kcal 목표에 맞는 추천 식단 알려줘`);
                    }}
                    className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-medium py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    이 칼로리에 맞는 식단 요청하기 <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Favorite Recipes */}
        {activeTab === 'favorites' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500 fill-current" /> 즐겨찾기 레시피 보관함
              </h2>
              <p className="text-xs text-slate-400">
                대화 중 마음에 들어 저장해둔 레시피들을 언제든 다시 확인하실 수 있습니다.
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                저장된 즐겨찾기 레시피가 없습니다. 챗봇 대화 중 하트 버튼을 눌러 레시피를 저장해보세요!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((recipe, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative shadow-lg">
                    <button
                      onClick={() => toggleFavorite(recipe)}
                      className="absolute top-4 right-4 text-rose-500 hover:text-slate-500 transition-colors"
                      title="즐겨찾기 삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-base text-slate-100 pr-6">{recipe.title}</h3>
                    <div className="flex gap-2 text-xs text-slate-400">
                      <span>⏱️ {recipe.time}</span>
                      <span>•</span>
                      <span>🔥 {recipe.calories}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>재료:</strong> {recipe.ingredients.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}