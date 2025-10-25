#!/usr/bin/env python3
"""
API 테스트 스크립트
사용법: python test_api.py [step]
  step: analysis, issues, precedents, report (기본값: analysis)
"""

import json
import sys
import requests
from pathlib import Path

# API 기본 URL
BASE_URL = "http://localhost:8000/api/v1"

# 색상 출력용
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'


def load_sample_data():
    """샘플 데이터 로드"""
    data_file = Path(__file__).parent / "test_data" / "sample_request.json"
    with open(data_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def print_section(title):
    """섹션 제목 출력"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{Colors.END}\n")


def print_success(message):
    """성공 메시지 출력"""
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")


def print_error(message):
    """에러 메시지 출력"""
    print(f"{Colors.RED}✗ {message}{Colors.END}")


def print_warning(message):
    """경고 메시지 출력"""
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")


def test_analysis():
    """1단계: 사실관계 검토 테스트"""
    print_section("1단계: 사실관계 검토")
    
    data = load_sample_data()
    
    print("📤 요청 전송 중...")
    try:
        response = requests.post(
            f"{BASE_URL}/analysis",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print_success(f"성공! (응답시간: {response.elapsed.total_seconds():.2f}초)")
            
            print("\n📋 결과:")
            print(f"\n사실관계 요약:\n{result.get('facts_summary', 'N/A')}")
            
            if result.get('key_points'):
                print(f"\n핵심 포인트:")
                for i, point in enumerate(result['key_points'], 1):
                    print(f"  {i}. {point}")
            
            # 결과 저장
            output_file = Path(__file__).parent / "test_data" / "step1_result.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print_success(f"\n결과 저장됨: {output_file}")
            
            return result
            
        else:
            print_error(f"실패: {response.status_code}")
            print(f"에러: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print_error("서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.")
        print_warning("서버 실행: uvicorn main:app --reload")
        return None
    except Exception as e:
        print_error(f"예외 발생: {e}")
        return None


def test_issues():
    """2단계: 쟁점 분석 테스트"""
    print_section("2단계: 쟁점 분석")
    
    # 1단계 결과 로드
    step1_file = Path(__file__).parent / "test_data" / "step1_result.json"
    if not step1_file.exists():
        print_warning("1단계 결과가 없습니다. 먼저 1단계를 실행하세요.")
        print("실행: python test_api.py analysis")
        return None
    
    with open(step1_file, 'r', encoding='utf-8') as f:
        analysis_result = json.load(f)
    
    data = load_sample_data()
    data['analysis_result'] = analysis_result
    
    print("📤 요청 전송 중...")
    try:
        response = requests.post(
            f"{BASE_URL}/issues",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print_success(f"성공! (응답시간: {response.elapsed.total_seconds():.2f}초)")
            
            print("\n📋 추출된 쟁점:")
            for i, issue in enumerate(result.get('issues', []), 1):
                print(f"\n{i}. {issue['title']} [{issue['importance']}]")
                print(f"   {issue['description'][:100]}...")
            
            # 결과 저장
            output_file = Path(__file__).parent / "test_data" / "step2_result.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print_success(f"\n결과 저장됨: {output_file}")
            
            return result
            
        else:
            print_error(f"실패: {response.status_code}")
            print(f"에러: {response.text}")
            return None
            
    except Exception as e:
        print_error(f"예외 발생: {e}")
        return None


def test_precedents():
    """3단계: 판례 리서치 테스트"""
    print_section("3단계: 판례 리서치")
    
    # 이전 단계 결과 로드
    step1_file = Path(__file__).parent / "test_data" / "step1_result.json"
    step2_file = Path(__file__).parent / "test_data" / "step2_result.json"
    
    if not step1_file.exists() or not step2_file.exists():
        print_warning("이전 단계 결과가 없습니다. 1, 2단계를 먼저 실행하세요.")
        return None
    
    with open(step1_file, 'r', encoding='utf-8') as f:
        analysis_result = json.load(f)
    with open(step2_file, 'r', encoding='utf-8') as f:
        issues_result = json.load(f)
    
    data = load_sample_data()
    data['analysis_result'] = analysis_result
    data['issues_result'] = issues_result
    
    print("📤 요청 전송 중...")
    try:
        response = requests.post(
            f"{BASE_URL}/precedents",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print_success(f"성공! (응답시간: {response.elapsed.total_seconds():.2f}초)")
            
            print("\n📋 쟁점별 판례:")
            for issue_prec in result.get('issue_precedents', []):
                print(f"\n쟁점: {issue_prec['issue_title']}")
                print(f"관련 판례 {len(issue_prec['precedents'])}건")
            
            # 결과 저장
            output_file = Path(__file__).parent / "test_data" / "step3_result.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print_success(f"\n결과 저장됨: {output_file}")
            
            return result
            
        else:
            print_error(f"실패: {response.status_code}")
            print(f"에러: {response.text}")
            return None
            
    except Exception as e:
        print_error(f"예외 발생: {e}")
        return None


def test_report():
    """4단계: 심사보고서 작성 테스트"""
    print_section("4단계: 심사보고서 작성")
    
    # 이전 단계 결과 로드
    results = {}
    for step in [1, 2, 3]:
        file_path = Path(__file__).parent / "test_data" / f"step{step}_result.json"
        if not file_path.exists():
            print_warning(f"{step}단계 결과가 없습니다. 이전 단계들을 먼저 실행하세요.")
            return None
        with open(file_path, 'r', encoding='utf-8') as f:
            results[f'step{step}'] = json.load(f)
    
    data = load_sample_data()
    data['analysis_result'] = results['step1']
    data['issues_result'] = results['step2']
    data['precedents_result'] = results['step3']
    
    print("📤 요청 전송 중...")
    try:
        response = requests.post(
            f"{BASE_URL}/report",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print_success(f"성공! (응답시간: {response.elapsed.total_seconds():.2f}초)")
            
            print("\n📋 심사보고서:")
            print(f"\n요약: {result.get('executive_summary', 'N/A')}")
            print(f"\n승소 가능성: {result.get('win_probability', 0)}%")
            print(f"집행 가능성: {result.get('execution_probability', 0)}%")
            
            # 결과 저장
            output_file = Path(__file__).parent / "test_data" / "step4_result.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print_success(f"\n결과 저장됨: {output_file}")
            
            return result
            
        else:
            print_error(f"실패: {response.status_code}")
            print(f"에러: {response.text}")
            return None
            
    except Exception as e:
        print_error(f"예외 발생: {e}")
        return None


def test_all():
    """전체 파이프라인 테스트"""
    print_section("전체 파이프라인 테스트")
    
    steps = [
        ("1단계: 사실관계 검토", test_analysis),
        ("2단계: 쟁점 분석", test_issues),
        ("3단계: 판례 리서치", test_precedents),
        ("4단계: 심사보고서 작성", test_report)
    ]
    
    for name, func in steps:
        result = func()
        if result is None:
            print_error(f"\n{name} 실패. 중단합니다.")
            return
        print_success(f"{name} 완료")
    
    print_section("전체 테스트 완료!")
    print_success("모든 단계가 성공적으로 완료되었습니다.")


def main():
    """메인 함수"""
    if len(sys.argv) > 1:
        step = sys.argv[1].lower()
    else:
        step = "analysis"
    
    steps_map = {
        "analysis": test_analysis,
        "issues": test_issues,
        "precedents": test_precedents,
        "report": test_report,
        "all": test_all
    }
    
    if step in steps_map:
        steps_map[step]()
    else:
        print_error(f"알 수 없는 단계: {step}")
        print("\n사용법: python test_api.py [step]")
        print("  step: analysis, issues, precedents, report, all")


if __name__ == "__main__":
    main()

