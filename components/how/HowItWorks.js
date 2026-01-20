export default function HowItWorks() {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-fg-secondary text-sm">
          WebViewer uses your browsers native capabilities to read and parse
          browser history.
        </p>
      </div>
      <div className="p-3">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Sql.js is used to read the file</li>
          <li>The browser native IndexedDB is used for storage</li>
          <li>IndexedDB is read and displayed</li>
          <li>No data ever leaves your browser</li>
        </ul>
      </div>
    </div>
  );
}
