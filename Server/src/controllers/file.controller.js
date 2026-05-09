function isAllowedResumeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

function filenameFromUrl(value) {
  try {
    const pathname = new URL(value).pathname;
    return decodeURIComponent(pathname.split("/").pop() || "resume.pdf");
  } catch {
    return "resume.pdf";
  }
}

function resumeUrlCandidates(value) {
  return [
    value,
    value.replace("/raw/upload/", "/image/upload/"),
    value.replace("/image/upload/", "/raw/upload/")
  ].filter((item, index, list) => item && list.indexOf(item) === index);
}

export async function viewResume(req, res, next) {
  try {
    const resumeUrl = String(req.query.url || "");

    if (!isAllowedResumeUrl(resumeUrl)) {
      return res.status(400).json({ message: "Invalid resume URL" });
    }

    let response;
    let loadedUrl = resumeUrl;

    for (const candidate of resumeUrlCandidates(resumeUrl)) {
      response = await fetch(candidate);
      loadedUrl = candidate;
      if (response.ok) break;
    }

    if (!response?.ok) {
      return res.status(response?.status || 502).json({
        message: "Could not load resume file",
        cloudinaryStatus: response?.status,
        cloudinaryUrl: loadedUrl
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = filenameFromUrl(resumeUrl);

    res.setHeader("Content-Type", response.headers.get("content-type") || "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}
