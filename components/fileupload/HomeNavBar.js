'use client';

import useHasStoredHistory from '@/hooks/useHasStoredHistory';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HELP_STEPS, SUPPORTED_BROWSERS, UPLOAD_WARNINGS } from './config';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { FaGithub, FaCoffee, FaQuestionCircle } from 'react-icons/fa';

export default function HomeNavBar() {
  const { hasData } = useHasStoredHistory();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0 items-center w-[300px] sm:w-[400px] md:w-[500px]">
      {/* GitHub link */}
      <div className="flex justify-center sm:justify-start">
        <Link href="https://github.com/bowenaguero/webviewer" target="_blank">
          <Button
            variant="ghost"
            className="text-gray-500 hover:bg-gray-800 text-sm"
          >
            <FaGithub className="size-4" />
            <span className="hidden xs:inline sm:inline">GitHub</span>
          </Button>
        </Link>
      </div>

      {/* Coffee link */}
      <div className="flex justify-center">
        <Link href="https://buymeacoffee.com/bowenaguero" target="_blank">
          <Button
            variant="ghost"
            className="text-gray-500 hover:bg-gray-800 text-sm"
          >
            <FaCoffee className="size-4" />
            <span className="hidden xs:inline sm:inline">Coffee</span>
          </Button>
        </Link>
      </div>

      {/* Help dropdown */}
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-gray-500 hover:bg-gray-800 text-sm"
            >
              <FaQuestionCircle className="size-4" />
              <span className="hidden xs:inline sm:inline">Help</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-72 sm:w-80 p-0">
            {/* App description */}
            <div className="px-4 py-3">
              <p className="text-sm text-gray-400">
                Analyze your browser history locally. Your data never leaves
                your device.
              </p>
            </div>

            <DropdownMenuSeparator />

            {/* Steps - Timeline */}
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-300 mb-3">Steps</p>
              <div className="space-y-3">
                {HELP_STEPS.map((step, i) => (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-800 shrink-0">
                      <step.icon className="size-3.5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="text-sm font-medium text-gray-200">
                        {step.label}
                      </span>
                      <span className="text-sm text-gray-500 ml-1.5">
                        — {step.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Supported browsers */}
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-300 mb-3">
                Supported
              </p>
              <div className="flex gap-5">
                {SUPPORTED_BROWSERS.map((b) => (
                  <div
                    key={b.name}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <b.icon className="size-5 text-gray-400" />
                    <span className="text-xs text-gray-500">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Warnings */}
            <div className="px-4 py-3 space-y-2">
              {UPLOAD_WARNINGS.map((w) => (
                <div key={w} className="flex items-center gap-2.5">
                  <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                  <span className="text-xs text-gray-400">{w}</span>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Continue (dimmed/disabled when no data) */}
      <div className="flex justify-center sm:justify-end">
        <Button
          variant="ghost"
          className={`text-sm ${hasData ? 'text-gray-500 hover:bg-gray-800' : 'text-gray-700 opacity-50 cursor-not-allowed'}`}
          disabled={!hasData}
          asChild={hasData}
        >
          {hasData ? (
            <Link href="/viewer">
              <span className="hidden xs:inline sm:inline">Continue</span>
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <>
              <span className="hidden xs:inline sm:inline">Continue</span>
              <ChevronRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
