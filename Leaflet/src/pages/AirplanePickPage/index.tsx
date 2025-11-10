import { useState, useEffect } from 'react';
import { Button, Toast, Image, Space } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { pickAirplane } from '../../services/airplane.service';
import airplanePickImg from '../../assets/images/airplane-pick.png';

export default function AirplanePickPage() {
  const navigate = useNavigate();
  const [airplaneContent, setAirplaneContent] = useState<string | null>(null);

  useEffect(() => {
    // 显示“正在取下纸飞机～” + 静态图
    Toast.show({
      content: '正在取下纸飞机～',
      duration: 2000,
      icon: <Image src={airplanePickImg} style={{ width: '80px', height: '80px' }} />,
    });

    // 2秒后模拟捞取结果
    const timer = setTimeout(() => {
      pickAirplane()
        .then(res => {
          if (res.data.message === '暂无纸飞机') {
            setAirplaneContent(null);
            Toast.show('当前暂无新纸飞机，稍后再来试试吧～');
          } else {
            setAirplaneContent(res.data.content);
            Toast.show('纸飞机已打开！');
          }
        })
        .catch(() => {
          // Mock 数据兜底
          setAirplaneContent('今天早八好困，但坚持住了！');
          Toast.show('纸飞机已打开！');
        });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleReply = () => {
    // 跳转到回复页（P0 可简化为跳回树页）
    navigate('/tree');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>摘取纸飞机</h3>

      {airplaneContent ? (
        <>
          <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <p>{airplaneContent}</p>
          </div>
          <Button color="primary" block onClick={handleReply}>
            回复
          </Button>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>当前暂无新纸飞机，稍后再来试试吧～</p>
        </div>
      )}

      <Button
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/tree')}
      >
        返回心情树
      </Button>
    </div>
  );
}