const fs = require('fs');

let content = fs.readFileSync('app/[locale]/admin/library/page.tsx', 'utf8');

content = content.replace(
  "import { UploadCloud, BookOpen, Trash2, Plus, Loader2, FileText, CheckCircle } from 'lucide-react';",
  "import { UploadCloud, BookOpen, Trash2, Plus, Loader2, FileText, CheckCircle, Link as LinkIcon } from 'lucide-react';"
);

content = content.replace(
  "const [showForm, setShowForm] = useState(false);",
  "const [showForm, setShowForm] = useState(false);\n  const [uploadMethod, setUploadMethod] = useState<'FILE' | 'LINK'>('FILE');\n"
);

content = content.replace(
  "type: 'SUMMARY',",
  "type: 'SUMMARY',\n    externalUrl: '',"
);

content = content.replace(
  "if (!file) return alert(isRtl ? 'الرجاء اختيار ملف' : 'Please select a file');",
  "if (uploadMethod === 'FILE' && !file) return alert(isRtl ? 'الرجاء اختيار ملف' : 'Please select a file');\n    if (uploadMethod === 'LINK' && !formData.externalUrl) return alert(isRtl ? 'الرجاء إدخال الرابط' : 'Please enter a URL');"
);

content = content.replace(
  "const uploadData = new FormData();",
  "let finalUrl = formData.externalUrl;\n\n      if (uploadMethod === 'FILE' && file) {\n        const uploadData = new FormData();"
);

content = content.replace(
  "const uploadJson = await uploadRes.json();\n      if (!uploadRes.ok) throw new Error(uploadJson.error || 'Upload failed');",
  "let uploadJson: any;\n        try {\n          uploadJson = await uploadRes.json();\n        } catch(e) {\n          if (uploadRes.status === 413) throw new Error(isRtl ? 'حجم الملف كبير جداً (الحد الأقصى 4.5 ميجا). يرجى ضغط الملف أو اختيار رابط خارجي لجوجل درايف.' : 'File too large (max 4.5MB). Please compress or use external link.');\n          throw new Error('Server error');\n        }\n        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Upload failed');\n        finalUrl = uploadJson.url;\n      }"
);

content = content.replace(
  "body: JSON.stringify({ ...formData, fileUrl: uploadJson.url })",
  "body: JSON.stringify({ ...formData, fileUrl: finalUrl })"
);

content = content.replace(
  "setFormData({ ...formData, titleAr: '', titleEn: '' });",
  "setFormData({ ...formData, titleAr: '', titleEn: '', externalUrl: '' });"
);

content = content.replace(
  /<div className="space-y-2">\s*<label className="text-sm font-bold text-slate-300">\{isRtl \? 'ملف الـ PDF' : 'PDF File'\}<\/label>[\s\S]*?<\/div>\s*<\/div>/,
  \<div className="space-y-4 col-span-1 md:col-span-2">
                <div className="flex gap-4 border-b border-slate-800 pb-2">
                  <button type="button" onClick={() => setUploadMethod('FILE')} className={\\\	ext-sm font-bold pb-2 border-b-2 transition-colors \\\\}>
                    {isRtl ? 'رفع ملف PDF' : 'Upload PDF'}
                  </button>
                  <button type="button" onClick={() => setUploadMethod('LINK')} className={\\\	ext-sm font-bold pb-2 border-b-2 transition-colors \\\\}>
                    {isRtl ? 'رابط خارجي (جوجل درايف)' : 'External Link (Drive)'}
                  </button>
                </div>

                {uploadMethod === 'FILE' ? (
                  <div className="relative">
                    <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full bg-slate-950 border border-slate-800 border-dashed rounded-xl px-4 py-6 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                      <UploadCloud className="w-8 h-8 mb-2" />
                      {file ? <span className="text-emerald-400 font-bold">{file.name}</span> : <span>{isRtl ? 'اضغط لاختيار ملف (أقل من 4.5 ميجا)' : 'Click to select PDF (max 4.5MB)'}</span>}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <LinkIcon className="h-5 w-5" />
                      </div>
                      <input type="url" value={formData.externalUrl} onChange={e => setFormData({...formData, externalUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white" placeholder="https://drive.google.com/..." />
                    </div>
                  </div>
                )}
              </div>
\
);

fs.writeFileSync('app/[locale]/admin/library/page.tsx', content, 'utf8');
console.log('Done');
