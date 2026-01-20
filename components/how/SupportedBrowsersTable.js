import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BROWSERS_TABLE_DATA } from '@/lib/constants/index';

export default function SupportedBrowsersTable() {
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="text-3xl font-bold">Supported Browsers</h2>
        <p className="text-fg-secondary text-sm">
          Additional browsers are planned for the future.
        </p>
      </div>
      <div className="border-2 border-stroke-subtle rounded-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-base hover:bg-surface-base">
              <TableHead className="p-4 w-[12%]">Browser</TableHead>
              <TableHead className="p-4 w-[10%]">Supported</TableHead>
              <TableHead className="p-4 w-[15%]">File Name</TableHead>
              <TableHead className="p-4 w-[40%]">File Path</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BROWSERS_TABLE_DATA.map((browser) => (
              <TableRow
                key={browser.name}
                className="bg-surface-base hover:bg-surface-page"
              >
                <TableCell className="p-4">{browser.name}</TableCell>
                <TableCell
                  className={`p-4 ${browser.supported ? 'text-accent-success' : 'text-accent-error'}`}
                >
                  {browser.supported ? 'Yes' : 'No'}
                </TableCell>
                <TableCell className="p-4">{browser.fileName}</TableCell>
                <TableCell className="p-4 whitespace-pre-wrap">
                  <code className="text-sm">{browser.filePath.join('\n')}</code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
