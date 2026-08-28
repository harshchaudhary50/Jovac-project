import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidSetup from './MermaidSetup';
import RechartSetUp from './RechartSetUp';
import { downloadPdf } from '../services/api';
import { FiDownload, FiZap, FiBookOpen, FiShare2, FiHelpCircle, FiBarChart2, FiCheckCircle } from 'react-icons/fi';

const markDownComponent = {
    h1: ({ children }) => (
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2224] dark:text-white mt-6 mb-4 border-b border-[#E8DFD5] dark:border-[#262626] pb-2">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#C85A32] dark:text-[#E6E2D3] mt-6 mb-3">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-base sm:text-lg font-serif font-bold text-[#2B5866] dark:text-[#EEEEEE] mt-5 mb-2">
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="text-xs sm:text-sm text-[#3E4549] dark:text-gray-300 leading-relaxed mb-4 font-normal">
            {children}
        </p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc ml-6 space-y-2 text-xs sm:text-sm text-[#3E4549] dark:text-gray-300 mb-4">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal ml-6 space-y-2 text-xs sm:text-sm text-[#3E4549] dark:text-gray-300 mb-4">
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li className="marker:text-[#C85A32] dark:marker:text-[#E6E2D3] leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
        <strong className="font-extrabold text-[#1E2224] dark:text-white">{children}</strong>
    ),
    code: ({ inline, children }) => (
        <code className="px-1.5 py-0.5 rounded-md bg-[#FAF0DC] dark:bg-[#222222] border border-[#DA9B42]/30 dark:border-[#303030] text-xs font-mono text-[#B86337] dark:text-[#E6E2D3]">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="p-4 my-4 rounded-2xl bg-[#1a1a1a] text-[#E6E2D3] text-xs font-mono overflow-x-auto border border-[#303030]">
            {children}
        </pre>
    ),
    blockquote: ({ children }) => (
        <blockquote className="p-4 my-4 rounded-2xl bg-[#FAF0DC] dark:bg-[#1a1a1a] border-l-4 border-[#DA9B42] dark:border-[#E6E2D3] text-xs font-semibold text-[#87532A] dark:text-[#E6E2D3]">
            {children}
        </blockquote>
    ),
    table: ({ children }) => (
        <div className="overflow-x-auto my-6 rounded-2xl border border-[#E8DFD5] dark:border-[#333333] shadow-xs">
            <table className="w-full text-xs text-left text-[#1E2224] dark:text-[#EEEEEE] border-collapse bg-white dark:bg-[#161616]">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-[#FAF7F2] dark:bg-[#222222] border-b border-[#E8DFD5] dark:border-[#333333] font-bold text-[11px] text-[#1E2224] dark:text-[#FFFFFF]">
            {children}
        </thead>
    ),
    tbody: ({ children }) => (
        <tbody className="divide-y divide-[#E8DFD5]/60 dark:divide-[#262626]">
            {children}
        </tbody>
    ),
    tr: ({ children }) => (
        <tr className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#1f1f1f] transition-colors">
            {children}
        </tr>
    ),
    th: ({ children }) => (
        <th className="px-4 py-3 font-extrabold text-[#1E2224] dark:text-[#FFFFFF] border-r border-[#E8DFD5]/40 dark:border-[#262626] last:border-r-0">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="px-4 py-3 text-[#3E4549] dark:text-[#E6E2D3] leading-relaxed border-r border-[#E8DFD5]/40 dark:border-[#262626] last:border-r-0">
            {children}
        </td>
    )
};

const cleanMarkdown = (text) => {
    if (!text) return "";
    if (typeof text !== "string") return String(text);
    
    let cleaned = text
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "  ")
        .replace(/\\"/g, '"');

    // Fix double pipes and pipe spaces | | into newlines
    cleaned = cleaned.replace(/\|\s*\|\s*/g, "|\n|");

    // Ensure proper newlines around markdown table structures
    cleaned = cleaned.replace(/([^\n])\n(\|.*\|)/g, "$1\n\n$2");
    cleaned = cleaned.replace(/(\|.*\|)\n([^\n|])/g, "$1\n\n$2");

    return cleaned.trim();
};

function FinalResult({ result }) {
    const [quickRevision, setQuickRevision] = useState(false);
    if (
        !result ||
        !result.subTopics ||
        !result.questions ||
        !result.questions.short ||
        !result.questions.long ||
        !result.revisionPoints
    ) {
        return null;
    }

    return (
        <div className="space-y-8 text-[#1E2224] dark:text-white">

            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8DFD5] dark:border-[#262626]">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2224] dark:text-white">
                        Generated Exam Notes
                    </h2>
                    <p className="text-xs text-[#5C6468] dark:text-gray-400 font-medium">Detailed theoretical study notes with real-world examples, diagrams, and revision takeaways.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        onClick={() => setQuickRevision(!quickRevision)} 
                        className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                            quickRevision
                                ? "bg-[#1E2224] dark:bg-white text-white dark:text-black shadow-sm"
                                : "bg-[#FAF0DC] dark:bg-[#222222] text-[#B86337] dark:text-[#E6E2D3] border border-[#DA9B42]/30 dark:border-[#303030] hover:bg-[#1E2224] dark:hover:bg-white hover:text-white dark:hover:text-black"
                        }`}
                    >
                        <FiZap className="w-3.5 h-3.5" />
                        <span>{quickRevision ? "Full Concept View" : "5-Min Revision Mode"}</span>
                    </button>

                    <button 
                        onClick={() => downloadPdf(result)}
                        className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] transition shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                        <FiDownload className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>

            {/* Detailed Notes Markdown (Main Section) */}
            {!quickRevision && (
                <section className="space-y-3">
                    <SectionHeader icon={<FiBookOpen />} title="Detailed Chapter & Concept Notes" color="teal" />
                    <div className="bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 sm:p-9 shadow-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markDownComponent}>
                            {cleanMarkdown(result.notes)}
                        </ReactMarkdown>
                    </div>
                </section>
            )}

            {/* Quick Revision Sheet */}
            {quickRevision && (
                <section className="rounded-3xl bg-[#FAF0DC] dark:bg-[#1e1e1e] border border-[#DA9B42]/40 dark:border-[#303030] p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2 text-[#B86337] dark:text-[#E6E2D3]">
                        <FiZap className="w-5 h-5 text-[#DA9B42] dark:text-[#E6E2D3]" />
                        <h3 className="font-serif font-bold text-xl text-[#1E2224] dark:text-white">
                            5-Minute Exam Revision Cheat Sheet
                        </h3>
                    </div>
                    <ul className="list-disc ml-6 space-y-2 text-xs sm:text-sm text-[#5C6468] dark:text-gray-300 leading-relaxed">
                        {result.revisionPoints.map((p, i) => (
                            <li key={i} className="marker:text-[#DA9B42] dark:marker:text-[#E6E2D3]">{p}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Mermaid Diagram */}
            {result.diagram?.data && (
                <section className="space-y-3">
                    <SectionHeader icon={<FiShare2 />} title="Visual Process Flowchart" color="olive" />
                    <div className="bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 overflow-x-auto">
                        <MermaidSetup diagram={result.diagram?.data} />
                    </div>
                    <p className="text-[11px] text-[#5C6468] dark:text-gray-400 italic">
                        Tip: You can export this flowchart along with your complete notes in the PDF download above.
                    </p>
                </section>
            )}

            {/* Visual Charts */}
            {result.charts?.length > 0 && (
                <section className="space-y-3">
                    <SectionHeader icon={<FiBarChart2 />} title="Topic Weightage & Visual Analytics" color="ochre" />
                    <div className="bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6">
                        <RechartSetUp charts={result.charts} />
                    </div>
                </section>
            )}

            {/* Important Exam Questions */}
            <section className="space-y-4">
                <SectionHeader icon={<FiHelpCircle />} title="Predicted Exam Questions" color="sienna" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] space-y-2">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#2B5866] dark:text-[#EEEEEE]">Short Answer Questions</p>
                        <ul className="list-disc ml-4 text-xs text-[#5C6468] dark:text-gray-400 space-y-1.5 leading-relaxed">
                            {result.questions.short.map((q, i) => (
                                <li key={i}>{q}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] space-y-2">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#C85A32] dark:text-[#E6E2D3]">Long Answer / Essay Questions</p>
                        <ul className="list-disc ml-4 text-xs text-[#5C6468] dark:text-gray-400 space-y-1.5 leading-relaxed">
                            {result.questions.long.map((q, i) => (
                                <li key={i}>{q}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {result.questions.diagram && (
                    <div className="p-5 rounded-2xl bg-[#EDF2E8] dark:bg-[#1e1e1e] border border-[#6B7B52]/30 dark:border-[#303030] space-y-1">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#6B7B52] dark:text-[#EEEEEE]">Diagram-Based Question</p>
                        <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed font-medium">{result.questions.diagram}</p>
                    </div>
                )}
            </section>

        </div>
    );
}

function SectionHeader({ icon, title, color = "terracotta" }) {
    const colorStyles = {
        terracotta: "bg-[#F5EBE1] dark:bg-[#222222] text-[#C85A32] dark:text-[#E6E2D3] border-[#EBD7BE] dark:border-[#303030]",
        teal: "bg-[#E4ECEF] dark:bg-[#222222] text-[#2B5866] dark:text-[#EEEEEE] border-[#2B5866]/20 dark:border-[#303030]",
        olive: "bg-[#EDF2E8] dark:bg-[#222222] text-[#6B7B52] dark:text-[#EEEEEE] border-[#6B7B52]/20 dark:border-[#303030]",
        ochre: "bg-[#FAF0DC] dark:bg-[#222222] text-[#B86337] dark:text-[#E6E2D3] border-[#DA9B42]/30 dark:border-[#303030]",
        sienna: "bg-[#F6ECE4] dark:bg-[#222222] text-[#B86337] dark:text-[#E6E2D3] border-[#E8DFD5] dark:border-[#303030]"
    };

    return (
        <div className={`px-4 py-2 rounded-2xl border font-bold text-xs flex items-center gap-2 w-fit ${colorStyles[color] || colorStyles.terracotta}`}>
            <span>{icon}</span>
            <span>{title}</span>
        </div>
    );
}

export default FinalResult;
