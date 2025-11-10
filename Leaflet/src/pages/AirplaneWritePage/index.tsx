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
      <h3>书写</h3>
      <p style={{ fontSize: '14px', color: '#bac659ff' }}>写下你的感受，它会飞向远方</p>

      <Input
        placeholder="写下你的心情（200字内）"
        value={content}
        onChange={(value) => {
          if (value.length <= 200) {
            setContent(value);
          }
        }}
        maxLength={200}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ textAlign: 'right', fontSize: '12px', color: '#999', marginBottom: '20px' }}>
        {content.length}/200
      </div>

      <Button color="primary" block onClick={handlePublish}>
        折成纸飞机
      </Button>
    </div>
  );
}