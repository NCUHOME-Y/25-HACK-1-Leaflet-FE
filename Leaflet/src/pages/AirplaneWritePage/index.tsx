// src/pages/AirplaneWritePage/index.tsx
import { useState } from 'react';
import { Input, Button, Toast, Image } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { publishAirplane } from '../../services/airplane.service';
import airplaneFlyImg from '../../assets/images/airplane-fly.png';

export default function AirplaneWritePage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handlePublish = async () => {
    if (!content.trim()) {
      Toast.show('请输入内容');
      return;
    }
    if (content.length > 200) {
      Toast.show('字数不能超过200字');
      return;
    }

    try {
      await publishAirplane(content);
      // 显示“纸飞机已飞走～” + 静态图
      Toast.show({
        content: '纸飞机已飞走～',
        duration: 3000,
        icon: <Image src={airplaneFlyImg} style={{ width: '80px', height: '80px' }} />,
      });
      // 3秒后跳回心情树页
      setTimeout(() => {
        navigate('/tree');
      }, 3000);
    } catch (error) {
      // 假设后端返回 { error: "换个积极的表达吧～" }
      Toast.show('换个积极的表达吧～');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>写纸折纸</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>写下你想分享的心情，它会变成纸飞机飞向别人的树上</p>

      <Input
        placeholder="写下你的心情（200字内）"
        value={content}
        onChange={setContent}
        maxLength={200}
        showCount
        style={{ marginBottom: '20px' }}
      />

      <Button color="primary" block onClick={handlePublish}>
        折成纸飞机
      </Button>
    </div>
  );
}