import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const supportedBrowsers = [
  {
    name: 'Chromium',
    supported: true,
    fileName: 'History',
    filePath: [
      'Windows: AppData/Local/Google/Chrome/User Data/Default/History',
      'macOS: Library/Application Support/Google/Chrome/Default/History',
    ],
  },
  {
    name: 'Firefox',
    supported: true,
    fileName: 'places.sqlite',
    filePath: [
      'Windows: AppData/Roaming/Mozilla/Firefox/Profiles/<your_profile>/places.sqlite',
      'macOS: Library/Application Support/Mozilla/Firefox/Profiles/Default/places.sqlite',
    ],
  },
  {
    name: 'Edge',
    supported: true,
    fileName: 'History',
    filePath: [
      'Windows: AppData/Local/Microsoft/Edge/User Data/Default/History',
      'macOS: Library/Application Support/Microsoft/Edge/Default/History',
    ],
  },
  {
    name: 'Safari',
    supported: true,
    fileName: 'History.db',
    filePath: ['macOS: ~/Library/Safari/History.db'],
  },
  {
    name: 'Opera (Not Tested)',
    supported: false,
    fileName: 'History',
    filePath: [
      'Windows: AppData/Local/Opera Software/Opera Stable/History',
      'macOS: Library/Application Support/Opera Software/Opera Stable/History',
    ],
  },
  {
    name: 'Brave (Not Tested)',
    supported: false,
    fileName: 'History',
    filePath: [
      'Windows: AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/History',
      'macOS: Library/Application Support/BraveSoftware/Brave-Browser/Default/History',
    ],
  },
];

export default function SupportedBrowsersTable() {
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="text-3xl font-bold">Supported Browsers</h2>
        <p className="text-gray-500 text-sm">
          Additional browsers are planned for the future.
        </p>
      </div>
      <div className="border-2 border-gray-700 rounded-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-950 hover:bg-gray-950">
              <TableHead className="p-4 w-[12%]">Browser</TableHead>
              <TableHead className="p-4 w-[10%]">Supported</TableHead>
              <TableHead className="p-4 w-[15%]">File Name</TableHead>
              <TableHead className="p-4 w-[40%]">File Path</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supportedBrowsers.map((browser) => (
              <TableRow
                key={browser.name}
                className="bg-gray-950 hover:bg-gray-900"
              >
                <TableCell className="p-4">{browser.name}</TableCell>
                <TableCell
                  className={`p-4 ${browser.supported ? 'text-green-500' : 'text-red-500'}`}
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
