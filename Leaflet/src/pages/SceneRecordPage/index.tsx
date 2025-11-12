import { useState, useEffect } from 'react';
import { Button, Toast, Image } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { recordMind, getSceneRecords } from '../../services/mind.service';
import type { MindRecord } from '../../services/mind.service';
import { useUser } from '../../lib/hooks/useUser';
import airplaneFlyImg from '../../assets/images/airplane-fly.png';

export default function SceneRecordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [records, setRecords] = useState<MindRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 从路由状态获取场景信息
  const scene = location.state?.scene || '';
  const sceneKey = location.state?.sceneKey || '';
  const emoji = location.state?.emoji || '';

  useEffect(() => {
    if (sceneKey) {
      loadSceneRecords();
    }
  }, [sceneKey]);

  // 快速模板
  const quickTemplates = [
    '今天因为___，感到___。',
    '此刻的心情是___。',
    '希望明天能___。',
    '感谢今天的___。'
  ];

  const loadSceneRecords = async () => {
    try {
      const response = await getSceneRecords(sceneKey);
      setRecords(response.data || []);
    } catch (error) {
      console.error('加载记录失败:', error);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      Toast.show('请输入内容');
      return;
    }
    if (content.length > 200) {
      Toast.show('字数不能超过200字');
      return;
    }

    setLoading(true);
    try {
      await recordMind({
        id: user.id,
        scene,
        sceneKey,
        content: content.trim()
      });

      // 显示成功提示
      Toast.show({
        content: '记录已保存～',
        duration: 2000,
        icon: <Image src={airplaneFlyImg} style={{ width: '60px', height: '60px' }} />,
      });

      // 清空输入框并重新加载记录
      setContent('');
      loadSceneRecords();

      // 2秒后返回记录页面
      setTimeout(() => {
        navigate('/record');
      }, 2000);
    } catch (error) {
      console.error('保存记录失败:', error);
      Toast.show('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/record');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)',
      padding: '20px'
    }}>
      {/* 头部 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <Button
          fill='none'
          size='small'
          onClick={handleBack}
          style={{ padding: '4px 8px' }}
        >
          ← 返回
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{emoji}</span>
          <h3 style={{ margin: 0, color: '#1a7f5a' }}>{scene}</h3>
        </div>
      </div>

      {/* 输入区域 */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6aa893',
          marginBottom: '12px'
        }}>
          记录下此刻的感受和想法
        </p>

        {/* 记录卡片 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: '#f6fffb',
          borderRadius: '8px',
          marginBottom: '12px',
          border: '1px solid #dff7ec'
        }}>
          <div style={{ fontSize: '22px' }}>{emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#1a7f5a', fontWeight: 600 }}>{scene}</div>
            <div style={{ fontSize: '12px', color: '#7fbf9b' }}>当前有若干人在此场景</div>
          </div>
          <Image src={airplaneFlyImg} style={{ width: 36, height: 36 }} />
        </div>

        <textarea
          placeholder="写下你的心情（100字内）"
          value={content}
          onChange={(e) => {
            const v = (e.target as HTMLTextAreaElement).value;
            if (v.length <= 100) setContent(v);
          }}
          maxLength={100}
          rows={6}
          style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#fafafa', borderRadius: 8, border: '1px solid #eee', resize: 'vertical' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {quickTemplates.map((t, i) => (
              <Button
                key={i}
                size='mini'
                fill='outline'
                onClick={() => setContent((prev) => (prev ? prev + ' ' + t : t))}
                style={{ borderColor: '#dff7ec', color: '#2b8a66' }}
              >
                {t.replace(/___/g, '...')}
              </Button>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: '#999' }}>{content.length}/100</div>
        </div>

        <Button
          color="primary"
          block
          onClick={handlePublish}
          loading={loading}
        >
          保存记录
        </Button>
      </div>

      {/* 历史记录 */}
      {records.length > 0 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          <h4 style={{
            margin: '0 0 16px 0',
            color: '#1a7f5a',
            fontSize: '16px'
          }}>
            历史记录
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {records.map((record, index) => (
              <div
                key={record.id || index}
                style={{
                  padding: '12px',
                  background: '#f9fbf9',
                  borderRadius: '8px',
                  borderLeft: '3px solid #4fb386'
                }}
              >
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#2b2b2b',
                  lineHeight: '1.4'
                }}>
                  {record.content}
                </p>
                {record.timestamp && (
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    {new Date(record.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}