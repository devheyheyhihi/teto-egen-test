import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';
import AdSense from './components/AdSense';

// 성격 유형 정의
interface PersonalityType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  color: string;
  emoji: string;
}

// 질문 인터페이스
interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: { [key: string]: number };
  }[];
}

// 스타일 컴포넌트들
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const TestContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

const QuestionContainer = styled.div`
  margin-bottom: 30px;
`;

const QuestionText = styled.h3`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ResultContainer = styled.div<{ color: string }>`
  text-align: center;
  background: ${props => props.color};
  color: white;
  padding: 40px;
  border-radius: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const ResultTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ResultDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const CharacteristicsItem = styled.li`
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px;
  }
`;

const RestartButton = styled.button`
  background: white;
  color: #333;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const StartButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
`;

const IntroText = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FoodChainContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
`;

const FoodChainTitle = styled.h4`
  color: white;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const FoodChainText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
`;

const CircularChain = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  margin: 20px auto;
  
  @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const ChainItem = styled.div<{ position: number; isActive?: boolean }>`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  text-align: center;
  transform: ${props => {
    const angle = (props.position * 90) - 90; // 0: 위, 1: 오른쪽, 2: 아래, 3: 왼쪽
    const radian = (angle * Math.PI) / 180;
    const radius = 110;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    return `translate(${x + 110}px, ${y + 110}px)`;
  }};
  background: ${props => {
    switch(props.position) {
      case 0: return '#e91e63'; // 에겐녀
      case 1: return '#9b59b6'; // 에겐남
      case 2: return '#f39c12'; // 테토녀
      case 3: return '#e74c3c'; // 테토남
      default: return '#666';
    }
  }};
  box-shadow: ${props => props.isActive ? '0 0 20px rgba(255, 255, 255, 0.8)' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  border: ${props => props.isActive ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 0.7rem;
    transform: ${props => {
      const angle = (props.position * 90) - 90;
      const radian = (angle * Math.PI) / 180;
      const radius = 90;
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      return `translate(${x + 95}px, ${y + 95}px)`;
    }};
  }
`;

const ChainArrow = styled.div<{ position: number }>`
  position: absolute;
  width: 30px;
  height: 30px;
  transform: ${props => {
    const angle = (props.position * 90) - 45; // 화살표는 각 아이템 사이에 위치
    const radian = (angle * Math.PI) / 180;
    const radius = 110;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    return `translate(${x + 125}px, ${y + 125}px) rotate(${angle + 90}deg)`;
  }};
  
  &::after {
    content: '→';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    color: #666;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
    transform: ${props => {
      const angle = (props.position * 90) - 45;
      const radian = (angle * Math.PI) / 180;
      const radius = 90;
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      return `translate(${x + 107}px, ${y + 107}px) rotate(${angle + 90}deg)`;
    }};
    
    &::after {
      font-size: 1rem;
    }
  }
`;

const ChainCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const AdContainer = styled.div`
  margin: 20px 0;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  background: #f8f9ff;
  
  @media (max-width: 768px) {
    margin: 15px 0;
    padding: 8px;
  }
`;

function App() {
  // 성격 유형 데이터 (실제 테토-에겐 이론 기반)
  const personalityTypes: PersonalityType[] = [
    {
      id: 'teto_male',
      name: '테토남',
      description: '테스토스테론 남성 - 공격성과 사냥 본능이 강하고, 주도적이며 현실 지향적인 남성',
      characteristics: [
        '공격성과 사냥 본능이 강함',
        '자기주장이 강하며 리더십 있음',
        '감정보다 논리를 우선시',
        '친구가 많고 무리 생활에 익숙',
        '외부 세계(정치, 사회적 지위)에 관심 많음',
        '단순하고 한 번 결정하면 밀어붙이는 스타일',
        '도전과 모험을 좋아함',
        '패션보다는 실용성 중시',
        '감정보다 행동으로 표현하는 연애 스타일'
      ],
      color: '#e74c3c',
      emoji: '💪'
    },
    {
      id: 'egen_male',
      name: '에겐남',
      description: '에스트로겐 남성 - 감수성과 섬세함이 뛰어나며, 예민하고 부드러운 남성',
      characteristics: [
        '감수성과 섬세함이 뛰어남',
        '자기 감정과 타인 감정에 민감',
        '추상적 개념(예술, 철학)에 흥미',
        '내면지향적이며 개인적 세계 중시',
        '활동성보다 정적인 취미 선호',
        '트렌드에 민감하고 미적 감각 뛰어남',
        'SNS 꾸미기에 능숙',
        '혼자만의 시간을 중요하게 여김',
        '연애에서 수동적이고 감성적 교류 중시'
      ],
      color: '#9b59b6',
      emoji: '🎨'
    },
    {
      id: 'teto_female',
      name: '테토녀',
      description: '테스토스테론 여성 - 활발하고 적극적이며, 독립적이고 도전적인 여성',
      characteristics: [
        '활발하고 적극적인 성격',
        '독립심이 강함',
        '단순한 사고 구조, 빠른 판단력',
        '유쾌하고 건강한 에너지',
        '주눅들지 않는 강한 멘탈',
        '성취나 커리어 중심적 사고',
        '운동이나 활동적 취미 선호',
        '스트릿 패션이나 힙한 스타일 선호',
        '호감 있는 이성에게 먼저 대시 가능'
      ],
      color: '#f39c12',
      emoji: '🔥'
    },
    {
      id: 'egen_female',
      name: '에겐녀',
      description: '에스트로겐 여성 - 부드럽고 감성적이며, 섬세하고 정적인 분위기의 여성',
      characteristics: [
        '주장이나 기가 강하지 않음',
        '복잡한 내면 구조를 가짐',
        '타인의 감정에 민감하고 공감 능력 높음',
        '감성적 유대와 안정감 중시',
        '부드럽고 정적인 분위기',
        '여성스럽고 클래식한 스타일 선호',
        '예술, 문학, 디자인 등에 깊은 몰입',
        '연애에서 수동적이고 이끌리는 편',
        '감정의 여운이 오래 지속됨'
      ],
      color: '#e91e63',
      emoji: '🌸'
    }
  ];

  // 질문 데이터 (실제 테토-에겐 특성 기반)
  const questions: Question[] = [
    {
      id: 1,
      text: '친구들과 있을 때 당신의 모습은?',
      options: [
        { text: '적극적으로 대화를 이끌고 분위기를 주도한다', scores: { teto: 3, egen: 0 } },
        { text: '조용히 듣고 있다가 필요할 때만 의견을 말한다', scores: { teto: 0, egen: 3 } },
        { text: '재미있는 이야기나 농담으로 분위기를 띄운다', scores: { teto: 2, egen: 1 } },
        { text: '다른 사람들의 기분을 살피며 배려한다', scores: { teto: 1, egen: 2 } }
      ]
    },
    {
      id: 2,
      text: '스트레스를 받을 때 어떻게 해소하나요?',
      options: [
        { text: '운동이나 격렬한 활동으로 풀어낸다', scores: { teto: 3, egen: 0 } },
        { text: '혼자만의 시간을 가지며 생각을 정리한다', scores: { teto: 0, egen: 3 } },
        { text: '친한 사람과 이야기하며 감정을 털어놓는다', scores: { teto: 1, egen: 2 } },
        { text: '술이나 게임 등으로 현실을 잠시 잊는다', scores: { teto: 2, egen: 1 } }
      ]
    },
    {
      id: 3,
      text: '연애할 때 당신의 스타일은?',
      options: [
        { text: '적극적으로 대시하고 주도권을 잡는다', scores: { teto: 3, egen: 0 } },
        { text: '상대방이 먼저 다가오기를 기다린다', scores: { teto: 0, egen: 3 } },
        { text: '감정적인 교감과 대화를 중시한다', scores: { teto: 1, egen: 2 } },
        { text: '실질적인 행동으로 사랑을 표현한다', scores: { teto: 2, egen: 1 } }
      ]
    },
    {
      id: 4,
      text: '패션이나 외모 관리에 대한 당신의 생각은?',
      options: [
        { text: '실용적이고 편한 것이 최고다', scores: { teto: 3, egen: 0 } },
        { text: '트렌드를 따라가며 세심하게 관리한다', scores: { teto: 1, egen: 2 } },
        { text: '클래식하고 우아한 스타일을 선호한다', scores: { teto: 0, egen: 3 } },
        { text: '개성 있고 힙한 스타일을 추구한다', scores: { teto: 2, egen: 1 } }
      ]
    },
    {
      id: 5,
      text: '갈등 상황에서 어떻게 대처하나요?',
      options: [
        { text: '직접적으로 맞서서 해결한다', scores: { teto: 3, egen: 0 } },
        { text: '조용히 피하거나 시간이 해결해주길 기다린다', scores: { teto: 0, egen: 3 } },
        { text: '중재자 역할을 하며 양쪽을 이해시킨다', scores: { teto: 1, egen: 2 } },
        { text: '감정적으로 반응하고 솔직하게 표현한다', scores: { teto: 2, egen: 1 } }
      ]
    },
    {
      id: 6,
      text: '여가 시간에 주로 무엇을 하나요?',
      options: [
        { text: '친구들과 만나거나 활동적인 취미 활동', scores: { teto: 3, egen: 0 } },
        { text: '혼자서 책을 읽거나 영화를 본다', scores: { teto: 0, egen: 3 } },
        { text: '예술 활동이나 창작 활동을 한다', scores: { teto: 1, egen: 2 } },
        { text: '새로운 도전이나 모험을 시도한다', scores: { teto: 2, egen: 1 } }
      ]
    },
    {
      id: 7,
      text: '의사결정을 할 때 가장 중요하게 생각하는 것은?',
      options: [
        { text: '빠른 결정과 즉시 실행', scores: { teto: 3, egen: 0 } },
        { text: '충분한 고민과 신중한 판단', scores: { teto: 0, egen: 3 } },
        { text: '다른 사람들의 의견과 조화', scores: { teto: 1, egen: 2 } },
        { text: '직감과 감정에 따른 선택', scores: { teto: 2, egen: 1 } }
      ]
    },
    {
      id: 8,
      text: '이상형에 대한 당신의 기준은?',
      options: [
        { text: '외모가 예쁘고/잘생기고 성격이 착한 사람', scores: { teto: 3, egen: 0 } },
        { text: '나를 이해해주고 감성적 교감이 가능한 사람', scores: { teto: 0, egen: 3 } },
        { text: '강하고 매력적인 사람', scores: { teto: 2, egen: 1 } },
        { text: '센스 있고 트렌디한 감각을 가진 사람', scores: { teto: 1, egen: 2 } }
      ]
    },
    {
      id: 9,
      text: 'SNS 사용 패턴은 어떤가요?',
      options: [
        { text: '별로 관심 없고 가끔 보는 정도', scores: { teto: 3, egen: 0 } },
        { text: '세심하게 꾸미고 자주 업데이트한다', scores: { teto: 0, egen: 3 } },
        { text: '일상을 소소하게 기록하는 편', scores: { teto: 1, egen: 2 } },
        { text: '힙하고 트렌디한 콘텐츠를 올린다', scores: { teto: 2, egen: 1 } }
      ]
    },
    {
      id: 10,
      text: '새로운 환경에 적응하는 당신의 방식은?',
      options: [
        { text: '빠르게 적응하고 적극적으로 사람들과 어울린다', scores: { teto: 3, egen: 0 } },
        { text: '천천히 관찰하며 조심스럽게 적응한다', scores: { teto: 0, egen: 3 } },
        { text: '몇몇 사람과 깊은 관계를 만든다', scores: { teto: 1, egen: 2 } },
        { text: '자신만의 방식으로 독립적으로 지낸다', scores: { teto: 2, egen: 1 } }
      ]
    }
  ];

  const [currentStep, setCurrentStep] = useState<'intro' | 'gender' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ teto: 0, egen: 0 });
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [result, setResult] = useState<PersonalityType | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);

  // 배열을 랜덤으로 섞는 함수
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 현재 질문이 바뀔 때마다 선택지를 랜덤으로 섞기
  useEffect(() => {
    if (currentStep === 'test' && questions[currentQuestion]) {
      setShuffledOptions(shuffleArray(questions[currentQuestion].options));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, currentStep]);

  const handleAnswer = (optionScores: { [key: string]: number }) => {
    const newScores = { ...scores };
    Object.keys(optionScores).forEach(key => {
      newScores[key as keyof typeof scores] += optionScores[key];
    });
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 테스트 완료 - 결과 계산
      const isTeto = newScores.teto > newScores.egen;
      let resultId: string;
      
      if (selectedGender === 'male') {
        resultId = isTeto ? 'teto_male' : 'egen_male';
      } else {
        resultId = isTeto ? 'teto_female' : 'egen_female';
      }
      
      const personalityResult = personalityTypes.find(type => type.id === resultId);
      setResult(personalityResult || personalityTypes[0]);
      setCurrentStep('result');
    }
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    setCurrentStep('test');
    // 첫 번째 질문의 선택지를 랜덤으로 섞기
    setShuffledOptions(shuffleArray(questions[0].options));
  };

  const restartTest = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setScores({ teto: 0, egen: 0 });
    setSelectedGender(null);
    setResult(null);
    setShuffledOptions([]);
  };

  const startTest = () => {
    setCurrentStep('gender');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // 연애 먹이사슬 정보
  const getFoodChainInfo = (type: string) => {
    switch (type) {
      case 'teto_male':
        return '테토남은 에겐녀에게 끌리는 경향이 있습니다. 자신에게 없는 부드러운 여성성과 섬세한 감수성에 매력을 느낍니다.';
      case 'egen_male':
        return '에겐남은 테토녀에게 끌리는 경향이 있습니다. 자신에게 부족한 추진력과 에너지를 지닌 상대에게 매력을 느낍니다.';
      case 'teto_female':
        return '테토녀는 테토남에게 끌리는 경향이 있습니다. 자신보다 더 강한 양기와 남성적인 매력을 가진 상대를 선호합니다.';
      case 'egen_female':
        return '에겐녀는 에겐남에게 끌리는 경향이 있습니다. 자신의 감수성과 정서를 잘 이해해주는 상대에게 매력을 느낍니다.';
      default:
        return '';
    }
  };

  // 원형 먹이사슬 컴포넌트
  const CircularFoodChain = ({ activeType }: { activeType?: string }) => {
    const chainTypes = [
      { id: 'egen_female', name: '에겐녀', emoji: '🌸' },
      { id: 'egen_male', name: '에겐남', emoji: '🎨' },
      { id: 'teto_female', name: '테토녀', emoji: '🔥' },
      { id: 'teto_male', name: '테토남', emoji: '💪' }
    ];

    return (
      <CircularChain>
        {chainTypes.map((type, index) => (
          <ChainItem 
            key={type.id} 
            position={index}
            isActive={activeType === type.id}
          >
            <div>{type.emoji}</div>
            <div>{type.name}</div>
          </ChainItem>
        ))}
        {[0, 1, 2, 3].map(index => (
          <ChainArrow key={index} position={index} />
        ))}
        <ChainCenter>
          연애<br/>먹이사슬
        </ChainCenter>
      </CircularChain>
    );
  };

  return (
    <Container>
      <TestContainer>
        {currentStep === 'intro' && (
          <>
            <Title>🧬 테토-에겐 성격 유형 테스트</Title>
            <IntroText>
              테스토스테론과 에스트로겐 성향을 바탕으로 한 성격 유형 테스트입니다.<br/>
              총 10개의 질문에 답하시면 4가지 유형 중 하나의 결과를 받으실 수 있습니다.<br/>
              <strong>테토남, 에겐남, 테토녀, 에겐녀</strong> 중 어떤 유형인지 알아보세요!
            </IntroText>
            
            <AdContainer>
              <AdSense
                adClient="ca-pub-YOUR-PUBLISHER-ID"
                adSlot="YOUR-AD-SLOT-ID"
                adFormat="auto"
                style={{ display: 'block', minHeight: '90px' }}
              />
            </AdContainer>
            
            <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
              <h4 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>💕 연애 먹이사슬 구조</h4>
              <CircularFoodChain />
              <p style={{ color: '#888', textAlign: 'center', fontSize: '0.9rem', marginTop: '15px' }}>
                각 유형은 시계방향으로 다음 유형에게 끌리는 순환 구조를 가집니다
              </p>
            </div>
            <StartButton onClick={startTest}>
              테스트 시작하기
            </StartButton>
          </>
        )}

        {currentStep === 'gender' && (
          <>
            <Title>성별을 선택해주세요</Title>
            <IntroText>
              테토-에겐 유형은 성별에 따라 구분됩니다.<br/>
              본인의 성별을 선택해주세요.
            </IntroText>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
              <OptionButton onClick={() => handleGenderSelect('male')}>
                👨 남성
              </OptionButton>
              <OptionButton onClick={() => handleGenderSelect('female')}>
                👩 여성
              </OptionButton>
            </div>
          </>
        )}

        {currentStep === 'test' && (
          <>
            <Title>테토-에겐 성격 유형 테스트</Title>
            <ProgressBar>
              <Progress progress={progress} />
            </ProgressBar>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
              질문 {currentQuestion + 1} / {questions.length}
            </p>
            
            {currentQuestion === 4 && (
              <AdContainer>
                <AdSense
                  adClient="ca-pub-YOUR-PUBLISHER-ID"
                  adSlot="YOUR-AD-SLOT-ID-2"
                  adFormat="auto"
                  style={{ display: 'block', minHeight: '90px' }}
                />
              </AdContainer>
            )}
            
            <QuestionContainer>
              <QuestionText>{questions[currentQuestion].text}</QuestionText>
              {shuffledOptions.map((option, index) => (
                <OptionButton
                  key={index}
                  onClick={() => handleAnswer(option.scores)}
                >
                  {option.text}
                </OptionButton>
              ))}
            </QuestionContainer>
          </>
        )}

        {currentStep === 'result' && result && (
          <>
            <Title>테스트 결과</Title>
            <ResultContainer color={result!.color}>
              <ResultTitle>{result!.emoji} {result!.name}</ResultTitle>
              <ResultDescription>{result!.description}</ResultDescription>
              
              <FoodChainContainer>
                <FoodChainTitle>💕 연애 먹이사슬에서의 위치</FoodChainTitle>
                <CircularFoodChain activeType={result!.id} />
                <FoodChainText>{getFoodChainInfo(result!.id)}</FoodChainText>
              </FoodChainContainer>

              <CharacteristicsList>
                {result!.characteristics.map((characteristic, index) => (
                  <CharacteristicsItem key={index}>
                    ✨ {characteristic}
                  </CharacteristicsItem>
                ))}
              </CharacteristicsList>
              
              <div style={{ margin: '20px 0', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px' }}>
                <AdSense
                  adClient="ca-pub-YOUR-PUBLISHER-ID"
                  adSlot="YOUR-AD-SLOT-ID-3"
                  adFormat="auto"
                  style={{ display: 'block', minHeight: '90px' }}
                />
              </div>
              
              <div style={{ marginTop: '30px', fontSize: '0.9rem', opacity: '0.8' }}>
                <p>⚠️ 이 테스트는 재미를 위한 것으로, 과학적 근거는 없습니다.</p>
                <p>실제 성격은 훨씬 복합적이고 다면적입니다.</p>
              </div>

              <RestartButton onClick={restartTest}>
                다시 테스트하기
              </RestartButton>
            </ResultContainer>
          </>
        )}
      </TestContainer>
    </Container>
  );
}

export default App;
