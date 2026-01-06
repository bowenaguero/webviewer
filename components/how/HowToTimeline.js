import { FaInfoCircle, FaFileDownload, FaUpload, FaEye } from 'react-icons/fa';

const instructions = [
  {
    title: 'Fetch your browser history file',
    description: 'Supported browser history files are listed below.',
    icon: FaFileDownload,
  },
  {
    title: 'Upload your browser history file',
    description: 'Upload your browser history file to WebViewer.',
    icon: FaUpload,
  },
  {
    title: 'View your browser history',
    description:
      'Browser history is displayed in a table format, which can be filtered by date, event type, and more.',
    icon: FaEye,
  },
];

export default function HowToTimeline() {
  return (
    <div className="flex flex-col gap-7 items-start">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="text-3xl font-bold">How To Use</h2>
        <p className="text-gray-500 text-sm">
          This tool was designed to be simple to use.
        </p>
      </div>
      <div className="flex flex-col gap-4 items-start">
        {/* Timeline */}
        <div className="relative pl-8 space-y-6">
          {instructions.map((instruction, index) => {
            const Icon = instruction.icon;
            return (
              <div key={instruction.title} className="relative">
                {/* Vertical line */}
                {index < instructions.length - 1 && (
                  <div className="absolute left-[-20px] top-8 w-0.5 h-full bg-gray-700" />
                )}
                {/* Icon circle */}
                <div className="absolute left-[-28px] top-0 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                  <Icon className="size-3 text-gray-400" />
                </div>
                {/* Content */}
                <div className="pb-2">
                  <h3 className="font-medium">{instruction.title}</h3>
                  <p className="text-gray-500 text-sm">{instruction.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info notes */}
        <div className="flex gap-2 items-center">
          <FaInfoCircle className="text-orange-500 size-4" />
          <span className="text-sm font-medium">
            You will need to append .db or .sqlite to the end of the file name
            to upload it.
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <FaInfoCircle className="text-orange-500 size-4" />
          <span className="text-sm font-medium">
            Browser history files can contain up to 500,000 entries.
          </span>
        </div>
      </div>
    </div>
  );
}
