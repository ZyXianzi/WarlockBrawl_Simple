### 简易版术士之战

#### django练习项目，前端使用jquery辅助开发

#### 项目系统设计
- `menu`: 菜单页面
- `playground`: 游戏页面
- `settings`: 设置页面

#### 项目文件结构
- templates目录：管理html文件
- urls目录：管理路由，即链接与函数的对应关系
- views目录：管理http函数
- models目录：管理数据库数据
- static目录：管理静态文件，比如：
    - css：对象的格式，比如位置、长宽、颜色、背景、字体大小等
    - js：对象的逻辑，比如对象的创建与销毁、事件函数、移动、变色等
    - image：图片
    - audio：声音
    - …
- consumers目录：管理websocket函数