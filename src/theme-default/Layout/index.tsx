import { Content } from '../../runtime/Content';
import 'uno.css';
export function Layout() {
  return (
    <div>
      <h1 color="red" p="2" m="4">
        Common Content
      </h1>
      <h1>Doc Content</h1>
      <Content />
    </div>
  );
}
