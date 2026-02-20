function AdminPageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[calc(100vh-210px)] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#c9dafb] border-t-[#2f65d5]"></div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <div className="mt-5 space-y-2">
          <div className="h-2 w-full animate-pulse rounded bg-slate-200"></div>
          <div className="h-2 w-5/6 animate-pulse rounded bg-slate-200"></div>
          <div className="h-2 w-2/3 animate-pulse rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminPageLoader;

