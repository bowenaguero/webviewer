import HowItWorks from '@/components/how/HowItWorks';
import HowToTimeline from '@/components/how/HowToTimeline';
import SupportedBrowsersTable from '@/components/how/SupportedBrowsersTable';

export default function How() {
  return (
    <div className="flex justify-center p-10">
      <div className="flex flex-col gap-10 p-10 items-start">
        <HowToTimeline />
        <hr className="w-full border-gray-700" />
        <SupportedBrowsersTable />
        <hr className="w-full border-gray-700" />
        <HowItWorks />
      </div>
    </div>
  );
}
