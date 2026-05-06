import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Coffee, Award, GraduationCap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              선배와 후배, 교수와 학생을 잇는 <span className="text-primary-600">Grad-Link</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              졸업한 선배들의 생생한 현업 이야기, 교수님의 전문적인 조언, 그리고 학우들과의 소통을 한 곳에서 만나보세요.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                시작하기
              </Link>
              <Link to="/community" className="text-sm font-semibold leading-6 text-gray-900">
                커뮤니티 둘러보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-2xl xl:max-w-3xl">
              <div className="w-full aspect-[16/10] rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl ring-1 ring-gray-900/10 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <GraduationCap className="h-20 w-20 md:h-32 md:w-32 mx-auto mb-4 opacity-50" />
                  <p className="text-xl md:text-2xl font-bold opacity-75">Grad-Link Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Grad-Link 서비스</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            여러분의 성장을 위한 모든 연결
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <Users className="h-5 w-5 flex-none text-primary-600" />
                멘토링 & 커피챗
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">현업에 계신 졸업생 선배님들과 1:1 멘토링이나 가벼운 커피챗을 신청해보세요.</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <BookOpen className="h-5 w-5 flex-none text-primary-600" />
                지식 공유 커뮤니티
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">질문 답변, 진로 고민, 공모전 팀원 모집 등 다양한 주제로 소통하세요.</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <Award className="h-5 w-5 flex-none text-primary-600" />
                포인트 & 리워드
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">활동을 통해 포인트를 쌓고, 우수 답변자로 선정되어 영향력을 넓혀보세요.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
