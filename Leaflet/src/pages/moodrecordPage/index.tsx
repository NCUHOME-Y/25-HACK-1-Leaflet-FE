// import { useState } from 'react';
// import { Input, Button, Space, List } from 'antd-mobile';

// const SCENES = [
//   '困倦的早八 😴',
//   '自习室刷题 📚',
//   '图书馆阅读 📖',
//   '食堂干饭 🍚',
//   '备考冲刺 ⏳',
//   '社团活动 🎭',
//   '情绪波动时 😡',
//   '睡前复盘 🌙',
//   '社交活动后 👥'
// ];

// const quickTemplates = [
//   '今天因为____，感觉____',
//   '虽然____，但我____',
//   '希望明天____'
// ];

// export default function MoodRecordPage() {
//   const [selectedScene, setSelectedScene] = useState('');
//   const [content, setContent] = useState('');

//   return (
//     <div style={{ padding: 16 }}>
//       <List header="选择校园场景">
//         {SCENES.map(scene => (
//           <List.Item
//             key={scene}
//             onClick={() => setSelectedScene(scene)}
//             style={{ backgroundColor: selectedScene === scene ? '#e6f7ff' : 'white' }}
//           >
//             {scene}
//           </List.Item>
//         ))}
//       </List>

//       {selectedScene && (
//         <div style={{ marginTop: 16 }}>
//           <p>当前 X 位同学同场景</p>
//           <Input
//             placeholder="写下你的心情（100字内）"
//             value={content}
//             onChange={setContent} // ✅ 正确：直接传入 setState
//             maxLength={100}       // ✅ 正确：注意拼写
//             showCount             // ✅ 正确：显示字数统计
//           />
//           <Space wrap style={{ margin: '12px 0' }}>
//             {quickTemplates.map(tpl => (
//               <Button
//                 size="small"
//                 key={tpl}
//                 onClick={() => setContent(tpl)} // ✅ Button 支持 onClick
//               >
//                 {tpl}
//               </Button>
//             ))}
//           </Space>
//           {/* 保存按钮 */}
//           <Button color="primary" block>
//             保存心情
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }