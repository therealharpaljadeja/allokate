import {
    ArrowDownCircleIcon,
    ArrowDownIcon,
    ArrowUpCircleIcon,
    ArrowUpIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Title from "./Title";
import { TActivity } from "@/src/utils/types";

function classNames(...className: string[]) {
    return className.join(" ");
}

export default function ApplicationActivity({
    activity,
}: {
    activity: TActivity[];
}) {
    return (
        <>
            <Title className="text-[20px] italic">Activity</Title>
            <ul role="list" className="mt-6 space-y-2 -bottom-2">
                {activity.map((activityItem, index) => (
                    <li
                        key={activityItem.id}
                        className="relative h-10 flex gap-x-4"
                    >
                        <div
                            className={classNames(
                                index === activity.length - 1
                                    ? "h-2"
                                    : "-bottom-2",
                                "absolute left-0 top-0 flex w-6 justify-center"
                            )}
                        >
                            <div className="w-px bg-color-100" />
                        </div>
                        <div className="relative h-6 w-6 flex border-2 border-color-100 items-center justify-center bg-color-500">
                            {activityItem.status === "Completed" && (
                                <div
                                    className="h-2 w-2 bg-green-600"
                                    aria-hidden="true"
                                />
                            )}
                            {activityItem.status === "Approved" && (
                                <div
                                    className="h-2 w-2 bg-blue-600"
                                    aria-hidden="true"
                                />
                            )}
                            {activityItem.status === "Rejected" && (
                                <div
                                    className="h-2 w-2 bg-red-600 text-red-600"
                                    aria-hidden="true"
                                />
                            )}
                            {activityItem.status === "none" && (
                                <div className="h-2 w-2 bg-gray-100" />
                            )}
                        </div>
                        <p className="py-0.5 text-[14px] leading-5 text-gray-500">
                            {activityItem.prefixText}
                            <span className="font-medium text-color-100">
                                {activityItem.href ? (
                                    <a target="_blank" href={activityItem.href}>
                                        {activityItem.textBold}
                                    </a>
                                ) : (
                                    activityItem.textBold
                                )}
                            </span>{" "}
                            {activityItem.suffixText}
                        </p>
                        <time
                            dateTime={activityItem.dateTime}
                            className="flex-none py-0.5 text-[12px] leading-5 text-color-300"
                        >
                            {activityItem.date}
                        </time>
                    </li>
                ))}
                {/* {props.activity.map((activityItem, activityItemIdx) => (
              <li key={activityItem.id} className="relative flex gap-x-4">
                <div
                  className={classNames(
                    activityItemIdx === props.activity.length - 1
                      ? "h-6"
                      : "-bottom-6",
                    "absolute left-0 top-0 flex w-6 justify-center"
                  )}
                >
                  <div className="w-px bg-gray-200" />
                </div>
    
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                  {activityItem.status === "Completed" && (
                    <CheckCircleIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  )}
                  {activityItem.status === "Approved" && (
                    <ArrowUpCircleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  )}
                  {activityItem.status === "Rejected" && (
                    <ArrowDownCircleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  )}
                  {activityItem.status === "none" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                  )}
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                  {activityItem.prefixText}
                  <span className="font-medium text-gray-900">
                    {activityItem.href ? (
                      <a target="_blank" href={activityItem.href}>{activityItem.textBold}</a>
                    ) : (
                      activityItem.textBold
                    )}
                  </span>{" "}
                  {activityItem.suffixText}
                </p>
                <time
                  dateTime={activityItem.dateTime}
                  className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                >
                  {activityItem.date}
                </time>
              </li>
            ))} */}
            </ul>
        </>
    );
}
