export default function HowItWorks() {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-gray-500 text-sm">
          This tool uses WebAssembly to read and parse the browser history file.
        </p>
      </div>
      <div className="p-3">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            Sql.js WASM is used to read the browser history file.
          </li>
          <li>
            The data is stored in your browser&apos;s native storage, IndexedDB.
          </li>
          <li>
            The local database is then read from IndexedDB and displayed in the
            GUI.
          </li>
          <li>
            Aside from Vercel analytics, no data ever leaves your browser.
          </li>
        </ul>
      </div>
    </div>
  );
}
